import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserDoc, updateUserDoc, deleteUserAccount } from '../firebase/users';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: '', email: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    getUserDoc(currentUser.uid).then((data) => {
      if (data) {
        setProfile({ name: data.name ?? '', email: data.email ?? '', address: data.address ?? '' });
      }
      setLoading(false);
    });
  }, [currentUser]);

  const handleChange = (e) => {
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateUserDoc(currentUser.uid, { name: profile.name, address: profile.address });
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError('Update failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure? This will permanently delete your account and all your data.')) return;
    setDeleting(true);
    try {
      await deleteUserAccount(currentUser.uid);
      await logout();
      navigate('/register');
    } catch (err) {
      setError('Delete failed: ' + err.message);
      setDeleting(false);
    }
  };

  if (loading) return <main className="profile-page"><p className="loading-text">Loading profile…</p></main>;

  return (
    <main className="profile-page">
      <div className="profile-card">
        <h1>My Profile</h1>
        {success && <p className="form-success">{success}</p>}
        {error && <p className="form-error">{error}</p>}
        <form className="auth-form" onSubmit={handleSave}>
          <label>
            Full Name
            <input name="name" value={profile.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" value={profile.email} disabled title="Email cannot be changed here" />
          </label>
          <label>
            Address
            <input name="address" value={profile.address} onChange={handleChange} placeholder="Your shipping address" />
          </label>
          <button type="submit" className="btn-primary btn-full" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <p>Permanently delete your account and all associated data.</p>
          <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete My Account'}
          </button>
        </div>
      </div>
    </main>
  );
}
