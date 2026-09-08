'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { haptic } from '@/lib/haptics';
import {
  OnboardingStep,
  ONBOARDING_STEPS,
  TOTAL_ONBOARDING_STEPS,
  getStepDef,
  getNextStep,
  getPrevStep,
  getStepNumber,
} from '@/lib/onboarding';

const INTEREST_OPTIONS = [
  'Technology', 'Music', 'Photography', 'Gaming', 'Travel', 'Food',
  'Fitness', 'Art', 'Film', 'Fashion', 'Science', 'Startups',
  'Crypto', 'Nature', 'Books', 'Design',
];

const SUGGESTED_PEOPLE = [
  { id: 'u2', name: 'Sarah Chen', avatar: '\uD83D\uDC69', bio: 'Hiker & photographer' },
  { id: 'u3', name: 'Alex Rivera', avatar: '\uD83E\uDDD4', bio: 'Pizza enthusiast' },
  { id: 'u4', name: 'Maya Patel', avatar: '\uD83D\uDC67', bio: 'Building AI tools' },
  { id: 'u5', name: 'Kai Johnson', avatar: '\uD83E\uDDD1\u200D\uD83C\uDFA4', bio: 'Music producer' },
  { id: 'u6', name: 'Luna Echo', avatar: '\uD83C\uDF06', bio: 'Digital artist' },
  { id: 'u7', name: 'Tom Wright', avatar: '\uD83D\uDC68\u200D\uD83E\uDDB3', bio: 'Writer & thinker' },
];

const AI_PERSONAS = [
  { id: 'professional', name: 'Professional', icon: '\uD83D\uDCBC', desc: 'Formal, precise, business-focused' },
  { id: 'friendly', name: 'Friendly', icon: '\uD83D\uDE0A', desc: 'Warm, casual, approachable' },
  { id: 'creative', name: 'Creative', icon: '\uD83C\uDFA8', desc: 'Imaginative, expressive, artistic' },
  { id: 'concise', name: 'Concise', icon: '\u2611\uFE0F', desc: 'Short, direct, to the point' },
];

export default function OnboardingShell() {
  const router = useRouter();
  const step = useStore((s) => s.onboardingStep);
  const advance = useStore((s) => s.advanceOnboarding);
  const goBack = useStore((s) => s.goBackOnboarding);
  const complete = useStore((s) => s.completeOnboarding);
  const onboardingData = useStore((s) => s.onboardingData);
  const authUser = useStore((s) => s.authUser);
  const updateProfile = useStore((s) => s.updateProfile);
  const setAiPersona = useStore((s) => s.setAiPersona);

  const def = getStepDef(step);
  const isComplete = step === 'complete';

  const handleNext = (stepData?: Record<string, unknown>) => {
    haptic('medium');
    if (step === 'privacy') {
      if (onboardingData.profile?.displayName) {
        updateProfile({ name: onboardingData.profile.displayName });
      }
      if (onboardingData.profile?.bio) {
        updateProfile({ bio: onboardingData.profile.bio });
      }
      if (onboardingData.profile?.avatar) {
        updateProfile({ avatar: onboardingData.profile.avatar });
      }
      complete(stepData);
      return;
    }
    if (step === 'complete') {
      haptic('success');
      router.push('/');
      return;
    }
    const next = getNextStep(step);
    if (next) advance(next, stepData);
  };

  const handleBack = () => {
    haptic('light');
    const prev = getPrevStep(step);
    if (prev) goBack(prev);
  };

  const stepIndex = def.index;
  const showBack = step !== 'welcome' && !isComplete;

  return (
    <div className="onb-shell">
      <div className="onb-container">
        <div className="onb-header">
          <div className="onb-logo">N</div>
          <div className="onb-brand">Nexus</div>
        </div>
        {!isComplete && (
          <div className="onb-progress">
            {ONBOARDING_STEPS.slice(0, TOTAL_ONBOARDING_STEPS).map((s) => (
              <div
                key={s.id}
                className={`onb-dot ${s.index === stepIndex ? 'active' : ''} ${s.index < stepIndex ? 'done' : ''}`}
              />
            ))}
          </div>
        )}
        {!isComplete && (
          <div className="onb-step-label">
            Step {getStepNumber(step)} of {TOTAL_ONBOARDING_STEPS}
          </div>
        )}
        <h1 className="onb-title">{def.title}</h1>
        <p className="onb-desc">{def.description}</p>
        <div className="onb-content">
          {step === 'welcome' && <WelcomeStep authUser={authUser} />}
          {step === 'account' && <AccountStep data={onboardingData} />}
          {step === 'profile' && <ProfileStep data={onboardingData} />}
          {step === 'interests' && <InterestsStep data={onboardingData} />}
          {step === 'people' && <PeopleStep data={onboardingData} />}
          {step === 'ai' && <AIStep data={onboardingData} setAiPersona={setAiPersona} />}
          {step === 'privacy' && <PrivacyStep data={onboardingData} />}
          {step === 'complete' && <CompleteStep />}
        </div>
        <div className="onb-buttons">
          {showBack && (
            <button className="onb-btn onb-btn-secondary" onClick={handleBack}>
              Back
            </button>
          )}
          <button
            className="onb-btn onb-btn-primary"
            onClick={() => handleNext()}
          >
            {def.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

function WelcomeStep({ authUser }: { authUser: { name: string; email: string } | null }) {
  return (
    <div className="onb-welcome">
      <div className="onb-welcome-icon">✨</div>
      {authUser && (
        <p className="onb-welcome-user">
          Welcome, <strong>{authUser.name}</strong>! Let's get your account set up.
        </p>
      )}
      <p className="onb-welcome-desc">
        Nexus brings together social, messaging, media, and AI in one secure, private space.
        This quick setup will personalise your experience.
      </p>
      <div className="onb-features">
        <div className="onb-feature">🔐 E2E Encrypted</div>
        <div className="onb-feature">🧠 AI Assistant</div>
        <div className="onb-feature">🎵 Music</div>
        <div className="onb-feature">📸 Stories</div>
      </div>
    </div>
  );
}

function AccountStep({ data }: { data: { account?: { username?: string; email?: string } } }) {
  const [username, setUsername] = useState(data.account?.username || '');
  const [email, setEmail] = useState(data.account?.email || '');
  const store = useStore();

  useEffect(() => {
    store.advanceOnboarding('account', { account: { username, email } });
  }, [username, email]);

  return (
    <div className="onb-form">
      <label className="onb-field">
        <span>Username</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="@yourname"
          className="onb-input"
          autoFocus
        />
      </label>
      <label className="onb-field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="onb-input"
        />
      </label>
    </div>
  );
}

function ProfileStep({ data }: { data: { profile?: { displayName?: string; bio?: string; avatar?: string } } }) {
  const [displayName, setDisplayName] = useState(data.profile?.displayName || '');
  const [bio, setBio] = useState(data.profile?.bio || '');
  const [avatar, setAvatar] = useState(data.profile?.avatar || '🧑');
  const avatars = ['🧑', '👩', '👨', '👧', '👦', '🧔', '🧍', '🌈'];
  const store = useStore();

  useEffect(() => {
    store.advanceOnboarding('profile', { profile: { displayName, bio, avatar } });
  }, [displayName, bio, avatar]);

  return (
    <div className="onb-form">
      <div className="onb-avatar-picker">
        {avatars.map((a) => (
          <button
            key={a}
            className={`onb-avatar-option ${avatar === a ? 'selected' : ''}`}
            onClick={() => setAvatar(a)}
          >
            {a}
          </button>
        ))}
      </div>
      <label className="onb-field">
        <span>Display Name</span>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          className="onb-input"
          autoFocus
        />
      </label>
      <label className="onb-field">
        <span>Bio</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell people about yourself..."
          className="onb-input onb-textarea"
          rows={3}
        />
      </label>
    </div>
  );
}

function InterestsStep({ data }: { data: { interests?: string[] } }) {
  const [selected, setSelected] = useState<string[]>(data.interests || []);
  const store = useStore();

  const toggle = (interest: string) => {
    const next = selected.includes(interest)
      ? selected.filter((i) => i !== interest)
      : [...selected, interest];
    setSelected(next);
  };

  useEffect(() => {
    store.advanceOnboarding('interests', { interests: selected });
  }, [selected]);

  return (
    <div className="onb-interests">
      <p className="onb-subtitle">Pick at least 3</p>
      <div className="onb-chip-grid">
        {INTEREST_OPTIONS.map((interest) => (
          <button
            key={interest}
            className={`onb-chip ${selected.includes(interest) ? 'selected' : ''}`}
            onClick={() => toggle(interest)}
          >
            {interest}
          </button>
        ))}
      </div>
    </div>
  );
}

function PeopleStep({ data }: { data: { people?: string[] } }) {
  const [following, setFollowing] = useState<string[]>(data.people || []);
  const store = useStore();

  const toggle = (id: string) => {
    const next = following.includes(id)
      ? following.filter((f) => f !== id)
      : [...following, id];
    setFollowing(next);
  };

  useEffect(() => {
    store.advanceOnboarding('people', { people: following });
  }, [following]);

  return (
    <div className="onb-people">
      <p className="onb-subtitle">Follow a few accounts to populate your feed</p>
      <div className="onb-people-list">
        {SUGGESTED_PEOPLE.map((person) => (
          <div key={person.id} className="onb-person">
            <div className="onb-person-avatar">{person.avatar}</div>
            <div className="onb-person-info">
              <div className="onb-person-name">{person.name}</div>
              <div className="onb-person-bio">{person.bio}</div>
            </div>
            <button
              className={`onb-follow-btn ${following.includes(person.id) ? 'following' : ''}`}
              onClick={() => toggle(person.id)}
            >
              {following.includes(person.id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIStep({ data, setAiPersona }: { data: { ai?: { persona?: string } }; setAiPersona: (p: string) => void }) {
  const [persona, setPersona] = useState(data.ai?.persona || 'friendly');
  const store = useStore();

  const select = (id: string) => {
    setPersona(id);
    setAiPersona(id);
  };

  useEffect(() => {
    store.advanceOnboarding('ai', { ai: { persona } });
  }, [persona]);

  return (
    <div className="onb-ai">
      <p className="onb-subtitle">Choose your AI assistant's personality</p>
      <div className="onb-persona-list">
        {AI_PERSONAS.map((p) => (
          <button
            key={p.id}
            className={`onb-persona ${persona === p.id ? 'selected' : ''}`}
            onClick={() => select(p.id)}
          >
            <span className="onb-persona-icon">{p.icon}</span>
            <div className="onb-persona-info">
              <div className="onb-persona-name">{p.name}</div>
              <div className="onb-persona-desc">{p.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PrivacyStep({ data }: { data: { privacy?: Record<string, unknown> } }) {
  const [settings, setSettings] = useState({
    privateAccount: (data.privacy?.privateAccount as boolean) || false,
    showOnlineStatus: (data.privacy?.showOnlineStatus as boolean) ?? true,
    readReceipts: (data.privacy?.readReceipts as boolean) ?? true,
    aiTraining: (data.privacy?.aiTraining as boolean) || false,
  });
  const store = useStore();

  useEffect(() => {
    store.advanceOnboarding('privacy', { privacy: settings });
  }, [settings]);

  const toggles = [
    { key: 'privateAccount' as const, label: 'Private Account', desc: 'Only approved followers can see your posts' },
    { key: 'showOnlineStatus' as const, label: 'Online Status', desc: 'Show when you are active' },
    { key: 'readReceipts' as const, label: 'Read Receipts', desc: 'Let others know when you read their messages' },
    { key: 'aiTraining' as const, label: 'AI Training', desc: 'Allow your data to improve AI models' },
  ];

  return (
    <div className="onb-privacy">
      <p className="onb-subtitle">Control your privacy and data</p>
      <div className="onb-toggles">
        {toggles.map((t) => (
          <div key={t.key} className="onb-toggle-row">
            <div className="onb-toggle-info">
              <div className="onb-toggle-label">{t.label}</div>
              <div className="onb-toggle-desc">{t.desc}</div>
            </div>
            <button
              className={`onb-toggle ${settings[t.key] ? 'on' : ''}`}
              onClick={() => setSettings({ ...settings, [t.key]: !settings[t.key] })}
            >
              <span className="onb-toggle-knob" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompleteStep() {
  return (
    <div className="onb-complete">
      <div className="onb-complete-icon">✅</div>
      <p className="onb-complete-text">
        Your account is ready. Click below to enter Nexus and start exploring your personalised feed.
      </p>
    </div>
  );
}
