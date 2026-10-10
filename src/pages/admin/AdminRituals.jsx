import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Badge, Button, Card, Checkbox, Input, Notice, Select, Spinner, Textarea } from '../../components/ui';

const EMPTY = { title: '', description: '', category: '', durationMin: 3, access: 'free', isActive: true, sortOrder: 0 };

function RitualForm({ initial, onSaved, onCancel }) {
  const editing = !!initial?.id;
  const [f, setF] = useState(initial ? { ...EMPTY, ...initial } : EMPTY);
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [removeAudio, setRemoveAudio] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData();
    form.append('title', f.title);
    form.append('description', f.description);
    form.append('category', f.category);
    form.append('durationMin', String(f.durationMin));
    form.append('access', f.access);
    form.append('isActive', f.isActive ? '1' : '0');
    form.append('sortOrder', String(f.sortOrder));
    if (image) form.append('image', image);
    if (audio) form.append('audio', audio);
    if (removeImage) form.append('removeImage', '1');
    if (removeAudio) form.append('removeAudio', '1');
    try {
      if (editing) await api.putForm(`/admin/rituals/${initial.id}`, form);
      else await api.postForm('/admin/rituals', form);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <h2 className="font-serif text-2xl text-[#16324A]">{editing ? 'Edit ritual' : 'New ritual'}</h2>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <Input label="Title" required maxLength={120} value={f.title} onChange={set('title')} />
        <Textarea label="Description" rows={3} maxLength={2000} value={f.description} onChange={set('description')} />
        <div className="grid gap-4 sm:grid-cols-4">
          <Input label="Category" maxLength={60} hint="e.g. Calm, Focus, Rest" value={f.category} onChange={set('category')} />
          <Input label="Minutes" type="number" min={0} max={600} value={f.durationMin} onChange={set('durationMin')} />
          <Select label="Access" value={f.access} onChange={set('access')}>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </Select>
          <Input label="Sort order" type="number" value={f.sortOrder} onChange={set('sortOrder')} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-[#16324A]">Image (optional, max 5MB)</p>
            {editing && initial.imageUrl && !removeImage && (
              <img src={initial.imageUrl} alt="" className="mt-2 h-24 rounded-lg object-cover" />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImage(e.target.files[0] || null)}
              className="mt-2 block w-full text-sm"
            />
            {editing && initial.imageUrl && (
              <div className="mt-2">
                <Checkbox checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} label="Remove current image" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-[#16324A]">Audio (optional, max 40MB)</p>
            {editing && initial.audioUrl && !removeAudio && <audio controls src={initial.audioUrl} className="mt-2 w-full" />}
            <input
              type="file"
              accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,audio/ogg"
              onChange={(e) => setAudio(e.target.files[0] || null)}
              className="mt-2 block w-full text-sm"
            />
            {editing && initial.audioUrl && (
              <div className="mt-2">
                <Checkbox checked={removeAudio} onChange={(e) => setRemoveAudio(e.target.checked)} label="Remove current audio" />
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-[#6E7B82]">
          Without an image or audio, the site and emails show &ldquo;No Image Still&rdquo; / &ldquo;No Audio Still&rdquo;. You can add them later.
        </p>

        <Checkbox checked={f.isActive} onChange={(e) => setF((s) => ({ ...s, isActive: e.target.checked }))} label="Active (visible to users)" />
        <Notice type="error">{error}</Notice>
        <div className="flex gap-3">
          <Button type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save ritual'}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function AdminRituals() {
  const [rituals, setRituals] = useState(null);
  const [editing, setEditing] = useState(null); // null | {} (new) | ritual
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const load = useCallback(async () => {
    try {
      const { rituals: list } = await api.get('/admin/rituals');
      setRituals(list);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(r) {
    if (!window.confirm(`Delete "${r.title}"? This also removes its image and audio.`)) return;
    try {
      await api.del(`/admin/rituals/${r.id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function testEmail(r) {
    setInfo('');
    setError('');
    try {
      const res = await api.post(`/admin/rituals/${r.id}/test-email`);
      setInfo(res.sent ? `Test email sent to you for "${r.title}".` : 'Email service is not configured, so nothing was sent.');
    } catch (err) {
      setError(err.message);
    }
  }

  if (editing) {
    return (
      <RitualForm
        initial={editing.id ? editing : null}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          load();
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-[#16324A]">Rituals</h1>
        <Button onClick={() => setEditing({})}>Add ritual</Button>
      </div>
      <Notice type="error">{error}</Notice>
      <Notice type="success">{info}</Notice>
      {!rituals ? (
        <Spinner />
      ) : rituals.length === 0 ? (
        <Card>
          <p className="text-sm text-[#6E7B82]">No rituals yet. Add your first one. Image and audio are optional.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {rituals.map((r) => (
            <Card key={r.id} className="!p-4 sm:!p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {r.imageUrl ? (
                    <img src={r.imageUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#F1EADB] text-center text-[9px] leading-tight text-[#9AA3A8]">
                      No Image Still
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#16324A]">{r.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#6E7B82]">
                      <Badge tone={r.access === 'premium' ? 'gold' : 'soft'}>{r.access}</Badge>
                      {r.category && <span>{r.category}</span>}
                      <span>{r.durationMin} min</span>
                      <span>{r.audioUrl ? 'Audio ✓' : 'No Audio Still'}</span>
                      {!r.isActive && <span className="font-semibold text-red-700">Hidden</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="!px-4 !py-2" onClick={() => setEditing(r)}>
                    Edit
                  </Button>
                  <Button variant="ghost" className="!px-4 !py-2" onClick={() => testEmail(r)}>
                    Send me test email
                  </Button>
                  <Button variant="ghost" className="!px-4 !py-2 !text-red-700" onClick={() => remove(r)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}