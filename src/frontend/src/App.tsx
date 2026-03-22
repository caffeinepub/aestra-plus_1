import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Bell,
  Bookmark,
  ChevronRight,
  Compass,
  Globe,
  Grid,
  Home,
  ImagePlus,
  Layers,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Music,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Type,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "home" | "discover" | "create" | "boards" | "profile";
type SubPage =
  | { kind: "notifications" }
  | { kind: "board-detail"; boardId: string }
  | { kind: "circles" }
  | { kind: "circle-detail"; circleId: string }
  | { kind: "settings" };

interface User {
  id: string;
  name: string;
  handle: string;
  color: string;
  initials: string;
}

interface Post {
  id: string;
  userId: string;
  type: "image" | "text" | "combined";
  content: string;
  mood: string;
  moodEmoji: string;
  gradient?: string;
  music?: { title: string; artist: string };
  time: string;
  reactions: { relate: number; feelThis: number; loveThis: number };
  comments: number;
}

interface Board {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  postCount: number;
}

interface Circle {
  id: string;
  name: string;
  emoji: string;
  members: string[];
  posts: Post[];
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const USERS: Record<string, User> = {
  luna: {
    id: "luna",
    name: "Luna",
    handle: "luna.glow",
    color: "#c4b5fd",
    initials: "L",
  },
  kai: {
    id: "kai",
    name: "Kai",
    handle: "kai.drift",
    color: "#93c5fd",
    initials: "K",
  },
  zara: {
    id: "zara",
    name: "Zara",
    handle: "zara.bloom",
    color: "#f9a8d4",
    initials: "Z",
  },
  milo: {
    id: "milo",
    name: "Milo",
    handle: "milo.verse",
    color: "#6ee7b7",
    initials: "M",
  },
  you: {
    id: "you",
    name: "Your Aura",
    handle: "you.aura",
    color: "#a78bfa",
    initials: "Y",
  },
};

const POSTS: Post[] = [
  {
    id: "p1",
    userId: "luna",
    type: "image",
    content: "soft mornings, slow living 🌙",
    mood: "chill",
    moodEmoji: "🌙",
    gradient: "linear-gradient(135deg, #e9d5ff 0%, #bfdbfe 100%)",
    music: { title: "Golden Hour", artist: "JVKE" },
    time: "2m ago",
    reactions: { relate: 24, feelThis: 18, loveThis: 41 },
    comments: 7,
  },
  {
    id: "p2",
    userId: "kai",
    type: "text",
    content:
      "reminder that you don't have to be productive every single day. rest is sacred too.",
    mood: "calm",
    moodEmoji: "🌿",
    time: "15m ago",
    reactions: { relate: 112, feelThis: 67, loveThis: 89 },
    comments: 14,
  },
  {
    id: "p3",
    userId: "zara",
    type: "image",
    content: "my study corner got an upgrade ✨",
    mood: "focused",
    moodEmoji: "✨",
    gradient: "linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)",
    music: { title: "Lofi Study Beats", artist: "ChillHop" },
    time: "1h ago",
    reactions: { relate: 55, feelThis: 33, loveThis: 78 },
    comments: 9,
  },
  {
    id: "p4",
    userId: "milo",
    type: "text",
    content:
      "3am thoughts: the universe is too big for any of us to be small-minded about anything.",
    mood: "late-night",
    moodEmoji: "🌌",
    time: "3h ago",
    reactions: { relate: 88, feelThis: 44, loveThis: 52 },
    comments: 21,
  },
  {
    id: "p5",
    userId: "luna",
    type: "combined",
    content:
      "healing looks different every day. today it looked like chamomile tea and a good book.",
    mood: "dreamy",
    moodEmoji: "☁️",
    gradient: "linear-gradient(135deg, #fef3c7 0%, #d1fae5 100%)",
    time: "5h ago",
    reactions: { relate: 203, feelThis: 156, loveThis: 189 },
    comments: 32,
  },
  {
    id: "p6",
    userId: "zara",
    type: "image",
    content: "vision board is manifesting 🌸",
    mood: "motivated",
    moodEmoji: "⚡",
    gradient: "linear-gradient(135deg, #fbcfe8 0%, #c7d2fe 100%)",
    music: { title: "About Damn Time", artist: "Lizzo" },
    time: "8h ago",
    reactions: { relate: 76, feelThis: 51, loveThis: 134 },
    comments: 18,
  },
  {
    id: "p7",
    userId: "kai",
    type: "text",
    content:
      "finding joy in ordinary moments is the most revolutionary act of this generation.",
    mood: "grateful",
    moodEmoji: "🌸",
    time: "12h ago",
    reactions: { relate: 144, feelThis: 97, loveThis: 211 },
    comments: 28,
  },
  {
    id: "p8",
    userId: "milo",
    type: "combined",
    content: "new playlist just dropped for your late night coding sessions 🎧",
    mood: "focused",
    moodEmoji: "✨",
    gradient: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
    music: { title: "Night Owl", artist: "Galimatias" },
    time: "1d ago",
    reactions: { relate: 39, feelThis: 28, loveThis: 63 },
    comments: 5,
  },
];

const BOARDS: Board[] = [
  {
    id: "b1",
    name: "Dream Life",
    emoji: "🌙",
    gradient: "linear-gradient(135deg, #e9d5ff 0%, #bfdbfe 100%)",
    postCount: 24,
  },
  {
    id: "b2",
    name: "Study Era",
    emoji: "📚",
    gradient: "linear-gradient(135deg, #bfdbfe 0%, #d1fae5 100%)",
    postCount: 18,
  },
  {
    id: "b3",
    name: "Healing",
    emoji: "✨",
    gradient: "linear-gradient(135deg, #fce7f3 0%, #fef3c7 100%)",
    postCount: 31,
  },
  {
    id: "b4",
    name: "Inspo",
    emoji: "🎨",
    gradient: "linear-gradient(135deg, #fbcfe8 0%, #c7d2fe 100%)",
    postCount: 12,
  },
];

const CIRCLES: Circle[] = [
  {
    id: "c1",
    name: "Study Circle",
    emoji: "📚",
    members: ["luna", "kai", "you"],
    posts: [POSTS[2], POSTS[7]],
  },
  {
    id: "c2",
    name: "Bestie Bubble",
    emoji: "💜",
    members: ["zara", "you"],
    posts: [POSTS[0], POSTS[4]],
  },
  {
    id: "c3",
    name: "Art Crew",
    emoji: "🎨",
    members: ["milo", "zara", "luna", "you"],
    posts: [POSTS[5], POSTS[1]],
  },
];

const MOODS = [
  { label: "Chill", emoji: "🌙" },
  { label: "Motivated", emoji: "⚡" },
  { label: "Sad", emoji: "🌧" },
  { label: "Inspired", emoji: "✨" },
  { label: "Grateful", emoji: "🌸" },
  { label: "Chaotic", emoji: "🌀" },
];

const MOOD_TAGS = [
  "calm",
  "chaotic",
  "late-night",
  "focused",
  "dreamy",
  "grateful",
];

const DISCOVER_POSTS = [...POSTS].sort(() => Math.random() - 0.5);

// ─── Helper Components ───────────────────────────────────────────────────────

function UserAvatar({ user, size = 36 }: { user: User; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: user.color,
        fontSize: size * 0.38,
      }}
    >
      {user.initials}
    </div>
  );
}

function MoodBadge({ mood, emoji }: { mood: string; emoji: string }) {
  return (
    <span
      className="aura-pill text-[11px] font-medium"
      style={{
        background: "oklch(0.94 0.04 295 / 0.6)",
        color: "oklch(0.45 0.12 295)",
      }}
    >
      {emoji} {mood}
    </span>
  );
}

function PostCard({
  post,
  showReactionCounts,
}: {
  post: Post;
  showReactionCounts: boolean;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [saved, setSaved] = useState(false);
  const user = USERS[post.userId];

  return (
    <article
      data-ocid={`feed.item.${post.id}`}
      className="aura-card mb-4 overflow-hidden animate-fade-in"
      style={{ boxShadow: "0 2px 20px 0 rgba(147,122,206,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <UserAvatar user={user} />
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground">
              @{user.handle} · {post.time}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MoodBadge mood={post.mood} emoji={post.moodEmoji} />
          <button
            type="button"
            onClick={() => setShowReactions(!showReactions)}
            className="p-1 rounded-full transition-colors hover:bg-muted active:scale-95"
            aria-label="More options"
          >
            <MoreHorizontal size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Media */}
      {(post.type === "image" || post.type === "combined") && post.gradient && (
        <div
          className="w-full"
          style={{
            height: 200,
            background: post.gradient,
          }}
        />
      )}

      {/* Content */}
      <div className="px-4 py-3">
        {post.type === "text" ? (
          <p
            className="text-[15px] leading-relaxed font-medium"
            style={{ color: "oklch(0.3 0.04 295)" }}
          >
            &ldquo;{post.content}&rdquo;
          </p>
        ) : (
          <p className="text-sm text-foreground leading-relaxed">
            {post.content}
          </p>
        )}

        {/* Music chip */}
        {post.music && (
          <div
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: "oklch(0.94 0.03 220 / 0.6)",
              color: "oklch(0.4 0.08 220)",
            }}
          >
            <Music size={11} />
            {post.music.title} · {post.music.artist}
          </div>
        )}
      </div>

      {/* Reactions panel */}
      {showReactions && (
        <div
          className="mx-4 mb-3 px-3 py-2.5 rounded-xl flex items-center gap-3 animate-scale-in"
          style={{ background: "oklch(0.96 0.02 295 / 0.6)" }}
        >
          {(
            [
              {
                key: "relate",
                label: "relate",
                emoji: "💭",
                count: post.reactions.relate,
              },
              {
                key: "feelThis",
                label: "feel this",
                emoji: "🤍",
                count: post.reactions.feelThis,
              },
              {
                key: "loveThis",
                label: "love this",
                emoji: "🌸",
                count: post.reactions.loveThis,
              },
            ] as const
          ).map((r) => (
            <button
              type="button"
              key={r.key}
              className="flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 transition-colors hover:bg-white active:scale-95"
              style={{ color: "oklch(0.45 0.1 295)" }}
            >
              <span>{r.emoji}</span>
              <span>{r.label}</span>
              {showReactionCounts && (
                <span className="text-muted-foreground ml-0.5">{r.count}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Action bar */}
      <div
        className="flex items-center gap-4 px-4 pb-4 pt-1"
        style={{ borderTop: "1px solid oklch(0.92 0.02 295 / 0.5)" }}
      >
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors active:scale-95"
          aria-label="Comments"
        >
          <MessageCircle size={15} />
          <span>{post.comments}</span>
        </button>
        <button
          type="button"
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-1.5 text-xs transition-colors active:scale-95 ${
            saved
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Save post"
          data-ocid={`feed.item.${post.id}.toggle`}
        >
          <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
          <span>{saved ? "Saved" : "Save"}</span>
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setShowReactions(!showReactions)}
          className="text-xs font-medium rounded-full px-3 py-1 transition-colors active:scale-95"
          style={{
            background: showReactions
              ? "oklch(0.72 0.12 295 / 0.15)"
              : "oklch(0.94 0.02 295 / 0.6)",
            color: "oklch(0.45 0.12 295)",
          }}
        >
          ✦ react
        </button>
      </div>
    </article>
  );
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function HomePage({
  onNotifications,
  showReactionCounts,
}: {
  onNotifications: () => void;
  showReactionCounts: boolean;
}) {
  const [selectedMood, setSelectedMood] = useState("Chill");

  return (
    <div data-ocid="home.page">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 pt-4 pb-3 flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: "oklch(0.45 0.12 295)" }}
          >
            Aestra Plus
          </h1>
          <p className="text-xs text-muted-foreground">your calm space ✦</p>
        </div>
        <button
          type="button"
          onClick={onNotifications}
          className="relative p-2 rounded-full transition-colors hover:bg-muted active:scale-95"
          aria-label="Notifications"
          data-ocid="home.notifications.button"
        >
          <Bell size={20} className="text-foreground" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "oklch(0.72 0.12 295)" }}
          />
        </button>
      </header>

      {/* Mood selector */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {MOODS.map((mood) => (
            <button
              type="button"
              key={mood.label}
              onClick={() => setSelectedMood(mood.label)}
              data-ocid="home.mood.tab"
              className={`flex-shrink-0 aura-pill flex items-center gap-1.5 transition-all active:scale-95 ${
                selectedMood === mood.label
                  ? "mood-selected"
                  : "mood-unselected"
              }`}
            >
              <span>{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <main className="px-4 pb-24">
        {POSTS.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showReactionCounts={showReactionCounts}
          />
        ))}
      </main>
    </div>
  );
}

function DiscoverPage() {
  const [query, setQuery] = useState("");

  const filtered = query
    ? DISCOVER_POSTS.filter(
        (p) =>
          p.content.toLowerCase().includes(query.toLowerCase()) ||
          p.mood.toLowerCase().includes(query.toLowerCase()),
      )
    : DISCOVER_POSTS;

  const trendingMoods = [
    "dreamy",
    "late-night",
    "focused",
    "healing",
    "chaotic",
  ];

  return (
    <div data-ocid="discover.page">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 pt-4 pb-3">
        <h1
          className="text-xl font-bold tracking-tight mb-3"
          style={{ color: "oklch(0.45 0.12 295)" }}
        >
          Discover
        </h1>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search moods, posts…"
            className="pl-9 rounded-full border-border bg-card"
            data-ocid="discover.search_input"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mt-3 pb-1">
          {trendingMoods.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setQuery(m)}
              data-ocid="discover.mood.tab"
              className="flex-shrink-0 aura-pill transition-colors active:scale-95"
              style={{
                background: "oklch(0.88 0.08 350 / 0.4)",
                color: "oklch(0.4 0.1 350)",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pb-24 pt-2">
        {filtered.length === 0 ? (
          <div data-ocid="discover.empty_state" className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground text-sm">
              nothing found for that vibe
            </p>
          </div>
        ) : (
          <div className="columns-2 gap-3">
            {filtered.map((post) => {
              const user = USERS[post.userId];
              return (
                <div
                  key={post.id}
                  data-ocid={`discover.item.${post.id}`}
                  className="break-inside-avoid mb-3 aura-card overflow-hidden animate-fade-in"
                  style={{ boxShadow: "0 2px 16px rgba(147,122,206,0.08)" }}
                >
                  {(post.type === "image" || post.type === "combined") &&
                    post.gradient && (
                      <div style={{ height: 100, background: post.gradient }} />
                    )}
                  <div className="p-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <UserAvatar user={user} size={22} />
                      <span className="text-xs font-semibold">{user.name}</span>
                    </div>
                    <p className="text-xs leading-relaxed line-clamp-3 text-foreground">
                      {post.content}
                    </p>
                    <span
                      className="mt-1.5 inline-block text-[10px] aura-pill"
                      style={{
                        background: "oklch(0.94 0.04 295 / 0.5)",
                        color: "oklch(0.5 0.1 295)",
                        padding: "2px 8px",
                      }}
                    >
                      {post.moodEmoji} {post.mood}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function CreatePage({ onDone }: { onDone: () => void }) {
  const [createType, setCreateType] = useState<
    "photo" | "thought" | "combined"
  >("thought");
  const [caption, setCaption] = useState("");
  const [selectedMoodTag, setSelectedMoodTag] = useState("");
  const [music, setMusic] = useState("");
  const [privacy, setPrivacy] = useState<"everyone" | "circles">("everyone");
  const [posting, setPosting] = useState(false);

  function handlePost() {
    if (!caption.trim()) return;
    setPosting(true);
    setTimeout(() => {
      setPosting(false);
      setCaption("");
      setSelectedMoodTag("");
      setMusic("");
      onDone();
    }, 900);
  }

  const typeOptions = [
    { key: "photo" as const, label: "Photo", icon: ImagePlus },
    { key: "thought" as const, label: "Thought", icon: Type },
    { key: "combined" as const, label: "Combined", icon: Layers },
  ];

  return (
    <div data-ocid="create.page" className="pb-28">
      <header className="px-4 pt-4 pb-3">
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ color: "oklch(0.45 0.12 295)" }}
        >
          New Post
        </h1>
        <p className="text-xs text-muted-foreground">share your vibe ✦</p>
      </header>

      <div className="px-4 space-y-5">
        {/* Type toggle */}
        <div
          className="flex rounded-2xl overflow-hidden p-1"
          style={{ background: "oklch(0.94 0.02 295 / 0.6)" }}
        >
          {typeOptions.map(({ key, label, icon: Icon }) => (
            <button
              type="button"
              key={key}
              onClick={() => setCreateType(key)}
              data-ocid={`create.${key}.tab`}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                createType === key
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Upload area (photo/combined) */}
        {(createType === "photo" || createType === "combined") && (
          <div
            data-ocid="create.dropzone"
            className="w-full h-44 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #e9d5ff 0%, #bfdbfe 100%)",
              border: "2px dashed oklch(0.72 0.12 295 / 0.4)",
            }}
          >
            <ImagePlus size={28} style={{ color: "oklch(0.55 0.12 295)" }} />
            <p
              className="text-sm mt-2 font-medium"
              style={{ color: "oklch(0.45 0.12 295)" }}
            >
              tap to add photo
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              jpg, png, gif
            </p>
          </div>
        )}

        {/* Caption */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Caption
          </p>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={
              createType === "thought"
                ? "what's on your mind?"
                : "add a caption…"
            }
            className="rounded-2xl resize-none border-border bg-card"
            rows={3}
            data-ocid="create.textarea"
          />
        </div>

        {/* Mood tags */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Mood Tag
          </p>
          <div className="flex flex-wrap gap-2">
            {MOOD_TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() =>
                  setSelectedMoodTag(selectedMoodTag === tag ? "" : tag)
                }
                data-ocid="create.mood.toggle"
                className={`aura-pill text-xs transition-all active:scale-95 ${
                  selectedMoodTag === tag
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Music */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Attach Music (optional)
          </p>
          <div className="relative">
            <Music
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={music}
              onChange={(e) => setMusic(e.target.value)}
              placeholder="Song - Artist"
              className="pl-9 rounded-full border-border bg-card"
              data-ocid="create.music.input"
            />
          </div>
        </div>

        {/* Privacy */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Who can see this?
          </p>
          <div className="flex gap-2">
            {[
              { key: "everyone" as const, label: "Everyone", icon: Globe },
              { key: "circles" as const, label: "Close Circles", icon: Lock },
            ].map(({ key, label, icon: Icon }) => (
              <button
                type="button"
                key={key}
                onClick={() => setPrivacy(key)}
                data-ocid={`create.privacy.${key}.toggle`}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-medium transition-all active:scale-95 ${
                  privacy === key
                    ? "bg-primary text-white shadow-soft"
                    : "bg-card border border-border text-muted-foreground"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Post button */}
        <button
          type="button"
          onClick={handlePost}
          disabled={!caption.trim() || posting}
          data-ocid="create.submit_button"
          className="w-full py-3.5 rounded-full text-white font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.12 295) 0%, oklch(0.65 0.15 280) 100%)",
          }}
        >
          {posting ? "Sharing your vibe…" : "Share Vibe ✦"}
        </button>
      </div>
    </div>
  );
}

function BoardDetailPage({
  board,
  onBack,
}: { board: Board; onBack: () => void }) {
  const boardPosts = POSTS.slice(0, 4);
  return (
    <div data-ocid="board.detail.page" className="animate-fade-in">
      <div
        className="relative"
        style={{ height: 160, background: board.gradient }}
      >
        <button
          type="button"
          onClick={onBack}
          data-ocid="board.detail.close_button"
          className="absolute top-4 left-4 p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm active:scale-95"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div className="absolute bottom-4 left-4">
          <p className="text-3xl">{board.emoji}</p>
          <h2 className="text-xl font-bold text-white drop-shadow-sm mt-1">
            {board.name}
          </h2>
          <p className="text-white/80 text-sm">{board.postCount} posts</p>
        </div>
      </div>
      <div className="px-4 py-4 pb-24">
        {boardPosts.map((post) => (
          <PostCard key={post.id} post={post} showReactionCounts={false} />
        ))}
      </div>
    </div>
  );
}

function BoardsPage({
  onBoardSelect,
}: {
  onBoardSelect: (board: Board) => void;
}) {
  return (
    <div data-ocid="boards.page">
      <header className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: "oklch(0.45 0.12 295)" }}
          >
            My Boards
          </h1>
          <p className="text-xs text-muted-foreground">
            your curated collections ✦
          </p>
        </div>
        <button
          type="button"
          data-ocid="boards.create.button"
          className="aura-pill font-medium transition-all active:scale-95"
          style={{
            background: "oklch(0.72 0.12 295)",
            color: "white",
            padding: "8px 16px",
          }}
        >
          + Create
        </button>
      </header>

      <div className="px-4 pb-24 grid grid-cols-2 gap-3">
        {BOARDS.map((board, i) => (
          <button
            type="button"
            key={board.id}
            onClick={() => onBoardSelect(board)}
            data-ocid={`boards.item.${i + 1}`}
            className="aura-card overflow-hidden text-left transition-all active:scale-95"
            style={{ boxShadow: "0 2px 16px rgba(147,122,206,0.08)" }}
          >
            <div style={{ height: 100, background: board.gradient }} />
            <div className="p-3">
              <p className="text-lg">{board.emoji}</p>
              <p className="font-semibold text-sm mt-0.5">{board.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {board.postCount} posts
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function NotificationsPage({ onBack }: { onBack: () => void }) {
  const notifs = [
    {
      id: "n1",
      user: "Luna",
      action: "related your post",
      emoji: "💭",
      time: "2m",
      isNew: true,
    },
    {
      id: "n2",
      user: "Kai",
      action: "commented: beautiful vibe ✨",
      emoji: "💬",
      time: "15m",
      isNew: true,
    },
    {
      id: "n3",
      user: "Zara",
      action: "saved your board",
      emoji: "🔖",
      time: "1h",
      isNew: true,
    },
    {
      id: "n4",
      user: "Study Circle",
      action: "new post from Kai",
      emoji: "📚",
      time: "3h",
      isNew: false,
    },
    {
      id: "n5",
      user: "Milo",
      action: "loved your thought",
      emoji: "🌸",
      time: "8h",
      isNew: false,
    },
    {
      id: "n6",
      user: "Bestie Bubble",
      action: "Zara shared exclusively",
      emoji: "💜",
      time: "1d",
      isNew: false,
    },
  ];

  const newNotifs = notifs.filter((n) => n.isNew);
  const oldNotifs = notifs.filter((n) => !n.isNew);

  return (
    <div data-ocid="notifications.page" className="animate-fade-in">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          data-ocid="notifications.close_button"
          className="p-2 rounded-full hover:bg-muted transition-colors active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <h1
          className="text-xl font-bold"
          style={{ color: "oklch(0.45 0.12 295)" }}
        >
          Notifications
        </h1>
      </header>

      <div className="px-4 pb-24">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          New
        </p>
        <div className="space-y-2 mb-6">
          {newNotifs.map((n, i) => (
            <div
              key={n.id}
              data-ocid={`notifications.item.${i + 1}`}
              className="aura-card px-4 py-3 flex items-center gap-3"
              style={{ background: "oklch(0.96 0.03 295 / 0.4)" }}
            >
              <span className="text-xl">{n.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{n.user}</span>{" "}
                  <span className="text-muted-foreground">{n.action}</span>
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {n.time}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Earlier
        </p>
        <div className="space-y-2">
          {oldNotifs.map((n, i) => (
            <div
              key={n.id}
              data-ocid={`notifications.item.${newNotifs.length + i + 1}`}
              className="aura-card px-4 py-3 flex items-center gap-3"
            >
              <span className="text-xl">{n.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{n.user}</span>{" "}
                  <span className="text-muted-foreground">{n.action}</span>
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {n.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CircleDetailPage({
  circle,
  onBack,
}: { circle: Circle; onBack: () => void }) {
  return (
    <div data-ocid="circle.detail.page" className="animate-fade-in">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          data-ocid="circle.detail.close_button"
          className="p-2 rounded-full hover:bg-muted transition-colors active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1
            className="text-lg font-bold"
            style={{ color: "oklch(0.45 0.12 295)" }}
          >
            {circle.emoji} {circle.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            {circle.members.length} members · private circle
          </p>
        </div>
      </header>
      <div className="px-4 pb-24">
        {circle.posts.map((post) => (
          <PostCard key={post.id} post={post} showReactionCounts={false} />
        ))}
      </div>
    </div>
  );
}

function CirclesPage({
  onCircleSelect,
  onBack,
}: {
  onCircleSelect: (circle: Circle) => void;
  onBack: () => void;
}) {
  return (
    <div data-ocid="circles.page" className="animate-fade-in">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          data-ocid="circles.close_button"
          className="p-2 rounded-full hover:bg-muted transition-colors active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: "oklch(0.45 0.12 295)" }}
          >
            Close Circles
          </h1>
          <p className="text-xs text-muted-foreground">
            your private spaces 💜
          </p>
        </div>
      </header>

      <div className="px-4 pb-24 space-y-3">
        {CIRCLES.map((circle, i) => (
          <button
            type="button"
            key={circle.id}
            onClick={() => onCircleSelect(circle)}
            data-ocid={`circles.item.${i + 1}`}
            className="w-full aura-card px-4 py-4 flex items-center gap-4 text-left transition-all active:scale-95"
            style={{ boxShadow: "0 2px 16px rgba(147,122,206,0.08)" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: "oklch(0.94 0.04 295 / 0.5)" }}
            >
              {circle.emoji}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{circle.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {circle.members.length} members · {circle.posts.length} posts
              </p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}

        <button
          type="button"
          data-ocid="circles.create.button"
          className="w-full aura-card px-4 py-4 flex items-center gap-4 text-left transition-all active:scale-95 border-2 border-dashed"
          style={{
            borderColor: "oklch(0.72 0.12 295 / 0.3)",
            background: "transparent",
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "oklch(0.94 0.04 295 / 0.5)" }}
          >
            +
          </div>
          <p
            className="font-medium text-sm"
            style={{ color: "oklch(0.55 0.1 295)" }}
          >
            Create a new circle
          </p>
        </button>
      </div>
    </div>
  );
}

function SettingsPage({
  onBack,
  showReactionCounts,
  onToggleReactionCounts,
}: {
  onBack: () => void;
  showReactionCounts: boolean;
  onToggleReactionCounts: (v: boolean) => void;
}) {
  const [showPostCounts, setShowPostCounts] = useState(true);
  const [feedMoods, setFeedMoods] = useState<Record<string, boolean>>({
    Chill: true,
    Motivated: true,
    Sad: false,
    Inspired: true,
    Grateful: true,
    Chaotic: false,
  });

  return (
    <div data-ocid="settings.page" className="animate-fade-in">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          data-ocid="settings.close_button"
          className="p-2 rounded-full hover:bg-muted transition-colors active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <h1
          className="text-xl font-bold"
          style={{ color: "oklch(0.45 0.12 295)" }}
        >
          Settings
        </h1>
      </header>

      <div className="px-4 pb-24 space-y-6">
        {/* Display preferences */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Display
          </p>
          <div className="aura-card divide-y divide-border">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-medium">Show reaction counts</p>
                <p className="text-xs text-muted-foreground">
                  Display numbers on reactions
                </p>
              </div>
              <Switch
                checked={showReactionCounts}
                onCheckedChange={onToggleReactionCounts}
                data-ocid="settings.reaction_counts.switch"
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-medium">
                  Show post counts on profile
                </p>
                <p className="text-xs text-muted-foreground">
                  Show number of posts
                </p>
              </div>
              <Switch
                checked={showPostCounts}
                onCheckedChange={setShowPostCounts}
                data-ocid="settings.post_counts.switch"
              />
            </div>
          </div>
        </section>

        {/* Feed preferences */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Feed Moods
          </p>
          <div className="aura-card px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {MOODS.map((mood) => (
                <button
                  type="button"
                  key={mood.label}
                  onClick={() =>
                    setFeedMoods((prev) => ({
                      ...prev,
                      [mood.label]: !prev[mood.label],
                    }))
                  }
                  data-ocid="settings.mood.toggle"
                  className={`aura-pill text-xs transition-all active:scale-95 ${
                    feedMoods[mood.label] ? "mood-selected" : "mood-unselected"
                  }`}
                >
                  {mood.emoji} {mood.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Privacy
          </p>
          <div className="aura-card divide-y divide-border">
            {(["Everyone", "Close Circles", "Only Me"] as const).map((opt) => (
              <div
                key={opt}
                className="flex items-center justify-between px-4 py-3"
              >
                <p className="text-sm">{opt}</p>
                <div
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                  style={{
                    borderColor:
                      opt === "Everyone"
                        ? "oklch(0.72 0.12 295)"
                        : "oklch(0.8 0 0)",
                    background:
                      opt === "Everyone"
                        ? "oklch(0.72 0.12 295)"
                        : "transparent",
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Danger zone */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Danger Zone
          </p>
          <div className="aura-card">
            <button
              type="button"
              data-ocid="settings.clear.delete_button"
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors active:scale-95"
              style={{ color: "oklch(0.55 0.18 27)" }}
            >
              <Trash2 size={15} />
              Clear all preferences
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfilePage({
  onSettings,
  onCircles,
  onBoardSelect,
}: {
  onSettings: () => void;
  onCircles: () => void;
  onBoardSelect: (board: Board) => void;
}) {
  const me = USERS.you;
  const myPosts = POSTS.slice(0, 6);
  const gradients = [
    "linear-gradient(135deg, #e9d5ff 0%, #bfdbfe 100%)",
    "linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)",
    "linear-gradient(135deg, #fef3c7 0%, #d1fae5 100%)",
    "linear-gradient(135deg, #bfdbfe 0%, #d1fae5 100%)",
    "linear-gradient(135deg, #fbcfe8 0%, #c7d2fe 100%)",
    "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
  ];

  return (
    <div data-ocid="profile.page">
      {/* Header gradient */}
      <div
        className="relative pt-8 pb-6 px-4"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.85 0.1 295) 0%, oklch(0.9 0.08 350) 100%)",
        }}
      >
        <button
          type="button"
          onClick={onSettings}
          data-ocid="profile.settings.button"
          className="absolute top-4 right-4 p-2 bg-white/30 backdrop-blur-sm rounded-full active:scale-95"
          aria-label="Settings"
        >
          <Settings size={18} className="text-white" />
        </button>

        <div className="flex flex-col items-center">
          <div
            className="rounded-full p-1"
            style={{
              background: "white",
              boxShadow: "0 0 0 3px oklch(0.72 0.12 295 / 0.4)",
            }}
          >
            <UserAvatar user={me} size={72} />
          </div>
          <h2 className="text-xl font-bold text-white mt-3">{me.name}</h2>
          <p className="text-white/80 text-sm">@{me.handle}</p>

          {/* Era badge */}
          <span
            className="mt-2 aura-pill font-medium text-xs"
            style={{
              background: "rgba(255,255,255,0.3)",
              color: "white",
              backdropFilter: "blur(8px)",
            }}
          >
            ✨ Glow Up Era
          </span>

          {/* Top moods */}
          <div className="flex gap-2 mt-3">
            {["🌙 chill", "✨ dreamy", "📚 focused"].map((m) => (
              <span
                key={m}
                className="aura-pill text-[11px]"
                style={{ background: "rgba(255,255,255,0.25)", color: "white" }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div
        className="px-4 py-4 bg-card"
        style={{ borderBottom: "1px solid oklch(0.92 0.02 295 / 0.5)" }}
      >
        <p className="text-sm text-center text-muted-foreground leading-relaxed">
          soft living, big dreams ✦ collecting beautiful moments
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-4">
          {[
            { label: "Posts", value: "48" },
            { label: "Boards", value: "4" },
            { label: "Circles", value: "3" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p
                className="text-lg font-bold"
                style={{ color: "oklch(0.45 0.12 295)" }}
              >
                {value}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Circles shortcut */}
        <button
          type="button"
          onClick={onCircles}
          data-ocid="profile.circles.button"
          className="mt-4 w-full flex items-center justify-between px-4 py-3 rounded-2xl active:scale-95 transition-all"
          style={{ background: "oklch(0.94 0.04 295 / 0.4)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">💜</span>
            <span className="text-sm font-medium">Close Circles</span>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
      </div>

      {/* Boards */}
      <div className="px-4 pt-5 pb-3">
        <p className="text-sm font-semibold mb-3">Boards</p>
        <div className="grid grid-cols-2 gap-3">
          {BOARDS.map((board, i) => (
            <button
              type="button"
              key={board.id}
              onClick={() => onBoardSelect(board)}
              data-ocid={`profile.board.item.${i + 1}`}
              className="aura-card overflow-hidden text-left transition-all active:scale-95"
            >
              <div style={{ height: 70, background: board.gradient }} />
              <div className="p-2.5">
                <p className="font-medium text-xs">
                  {board.emoji} {board.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent posts grid */}
      <div className="px-4 pt-2 pb-28">
        <p className="text-sm font-semibold mb-3">Recent Posts</p>
        <div className="grid grid-cols-3 gap-1.5">
          {myPosts.map((post, i) => (
            <div
              key={post.id}
              data-ocid={`profile.post.item.${i + 1}`}
              className="aspect-square rounded-xl overflow-hidden"
              style={{
                background: post.gradient ?? gradients[i % gradients.length],
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

function BottomNav({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  const tabs: {
    key: Tab;
    label: string;
    Icon: React.FC<{ size?: number; strokeWidth?: number }>;
  }[] = [
    { key: "home", label: "Home", Icon: Home },
    { key: "discover", label: "Discover", Icon: Compass },
    { key: "create", label: "Create", Icon: Plus },
    { key: "boards", label: "Boards", Icon: Grid },
    { key: "profile", label: "Profile", Icon: UserIcon },
  ];

  return (
    <nav
      data-ocid="nav.tab"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card/90 backdrop-blur-xl"
      style={{ borderTop: "1px solid oklch(0.92 0.03 295 / 0.6)" }}
    >
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {tabs.map(({ key, label, Icon }) => {
          const isActive = active === key;
          const isCreate = key === "create";
          return (
            <button
              type="button"
              key={key}
              onClick={() => onChange(key)}
              data-ocid={`nav.${key}.tab`}
              className="flex flex-col items-center gap-0.5 min-w-[60px] transition-all active:scale-90"
            >
              {isCreate ? (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-soft"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.12 295) 0%, oklch(0.65 0.15 280) 100%)",
                  }}
                >
                  <Icon size={22} strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <span
                    style={{
                      color: isActive
                        ? "oklch(0.55 0.15 295)"
                        : "oklch(0.6 0 0)",
                    }}
                  >
                    <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                  </span>
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color: isActive
                        ? "oklch(0.55 0.15 295)"
                        : "oklch(0.6 0 0)",
                    }}
                  >
                    {label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [subPage, setSubPage] = useState<SubPage | null>(null);
  const [showReactionCounts, setShowReactionCounts] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

  function navigate(tab: Tab) {
    setSubPage(null);
    setSelectedBoard(null);
    setSelectedCircle(null);
    setActiveTab(tab);
  }

  function handleBoardSelect(board: Board) {
    setSelectedBoard(board);
    setSubPage({ kind: "board-detail", boardId: board.id });
  }

  function handleCircleSelect(circle: Circle) {
    setSelectedCircle(circle);
    setSubPage({ kind: "circle-detail", circleId: circle.id });
  }

  function renderContent() {
    // Sub-pages overlay current tab
    if (subPage) {
      if (subPage.kind === "notifications") {
        return <NotificationsPage onBack={() => setSubPage(null)} />;
      }
      if (subPage.kind === "board-detail" && selectedBoard) {
        return (
          <BoardDetailPage
            board={selectedBoard}
            onBack={() => setSubPage(null)}
          />
        );
      }
      if (subPage.kind === "settings") {
        return (
          <SettingsPage
            onBack={() => setSubPage(null)}
            showReactionCounts={showReactionCounts}
            onToggleReactionCounts={setShowReactionCounts}
          />
        );
      }
      if (subPage.kind === "circles") {
        return (
          <CirclesPage
            onCircleSelect={handleCircleSelect}
            onBack={() => setSubPage(null)}
          />
        );
      }
      if (subPage.kind === "circle-detail" && selectedCircle) {
        return (
          <CircleDetailPage
            circle={selectedCircle}
            onBack={() => setSubPage({ kind: "circles" })}
          />
        );
      }
    }

    switch (activeTab) {
      case "home":
        return (
          <HomePage
            onNotifications={() => setSubPage({ kind: "notifications" })}
            showReactionCounts={showReactionCounts}
          />
        );
      case "discover":
        return <DiscoverPage />;
      case "create":
        return <CreatePage onDone={() => navigate("home")} />;
      case "boards":
        return <BoardsPage onBoardSelect={handleBoardSelect} />;
      case "profile":
        return (
          <ProfilePage
            onSettings={() => setSubPage({ kind: "settings" })}
            onCircles={() => setSubPage({ kind: "circles" })}
            onBoardSelect={handleBoardSelect}
          />
        );
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.93 0.02 295 / 0.3)" }}
    >
      {/* Mobile container */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: 430,
          minHeight: "100svh",
          background: "oklch(0.97 0.01 80)",
        }}
      >
        {/* Scrollable content */}
        <div
          className="overflow-y-auto"
          style={{ minHeight: "100svh", paddingBottom: 80 }}
        >
          {renderContent()}
        </div>

        {/* Bottom nav — only show when not in a full sub-page that has its own back nav */}
        {!subPage && <BottomNav active={activeTab} onChange={navigate} />}
        {subPage && subPage.kind !== "board-detail" && (
          <BottomNav active={activeTab} onChange={navigate} />
        )}
      </div>

      {/* Footer (desktop only) */}
      <footer
        className="hidden sm:flex justify-center py-4 text-xs text-center"
        style={{ color: "oklch(0.65 0.05 295)" }}
      >
        © {new Date().getFullYear()}. Built with ♥ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="ml-1 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
