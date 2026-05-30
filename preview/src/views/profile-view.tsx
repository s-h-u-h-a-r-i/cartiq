import { Card } from '../components/card';
import { profile } from '../mock-data';

export const ProfileView = () => (
  <section class="profile-grid">
    <div class="section-head">
      <div>
        <h1>Profile</h1>
        <p class="muted">Preview-only account surface.</p>
      </div>
    </div>

    <Card title="Account">
      <div class="profile-card">
        <span class="avatar avatar--large" aria-hidden="true">
          {profile.avatar}
        </span>
        <div>
          <div class="label">Name</div>
          <h2>{profile.name}</h2>
          <p class="muted">{profile.email}</p>
        </div>
      </div>
      <div class="profile-actions">
        <button class="btn btn--secondary" type="button">
          Preferences
        </button>
        <button class="btn btn--primary" type="button">
          Save mock changes
        </button>
      </div>
    </Card>
  </section>
);
