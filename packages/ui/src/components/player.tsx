import { type ReactNode, useState } from 'react';
import { Button } from './button';
import { playerSlots } from './slots';
import { fill, useUiText } from './ui-text';

/** One track in the queue. */
export type PlayerQueueItem = {
  uid: string;
  title: string;
  artist?: string | null;
  /** The length in seconds, when known. */
  duration: number | null;
};

/** One choice of playback quality. */
export type PlayerQuality = { value: string; label: string };

/** Props for {@link MediaPlayer}. */
type MediaPlayerProps = {
  queue: PlayerQueueItem[];
  currentUid: string | null;
  /** The playing track as it is shown: its title (a link when it has a page) and artist. */
  now: { title: ReactNode; artist?: string | null } | null;
  playing: boolean;
  /** Where playback is, in seconds. */
  position: number;
  /** The length of the track, in seconds. */
  duration: number;
  /** The volume, 0 to 1. */
  volume: number;
  quality: string;
  qualities: PlayerQuality[];
  /** What is playing, such as the format and bit rate. */
  rendition: string | null;
  /** Why playback failed, if it did. */
  error: string | null;
  panelOpen: boolean;
  /** Writes a number of seconds as time. */
  formatTime: (seconds: number) => ReactNode;
  onTogglePanel: () => void;
  onPlayItem: (uid: string) => void;
  onMove: (uid: string, index: number) => void;
  onRemove: (uid: string) => void;
  onClear: () => void;
  onPrev: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
  onVolume: (volume: number) => void;
  onQuality: (value: string) => void;
  /** Makes a link that opens the queue; leave it out to hide the permalink button. Returns the address. */
  onPermalink?: () => Promise<string>;
};

/**
 * The player bar and its queue panel. It only draws what it is given: the app owns the playback and the queue, and
 * passes the state and the handlers. The queue panel scrolls, accepts drag-and-drop reordering and has a permalink
 * button. Slot recipe `player`.
 *
 * @param props - the state, the wording of the options and the handlers.
 * @returns the player, or nothing when the queue is empty.
 */
export function MediaPlayer(props: MediaPlayerProps) {
  const t = useUiText();
  const {
    queue,
    currentUid,
    now,
    playing,
    position,
    duration,
    volume,
    quality,
    qualities,
    rendition,
    error,
    panelOpen,
    formatTime,
  } = props;
  const classes = playerSlots();
  const [dragUid, setDragUid] = useState<string | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [permalink, setPermalink] = useState<string | null>(null);
  const [linkError, setLinkError] = useState(false);

  if (queue.length === 0) return null;

  const makePermalink = async () => {
    setLinkError(false);
    try {
      const url = await props.onPermalink?.();
      if (!url) return;
      setPermalink(url);
      await navigator.clipboard?.writeText(url).catch(() => undefined);
    } catch {
      setLinkError(true);
    }
  };

  return (
    <div data-no-print>
      {panelOpen && (
        <div className={classes.panel}>
          <div className={classes.panelHead}>
            <strong>{fill(t.queue, { count: queue.length })}</strong>
            {props.onPermalink && (
              <button type="button" onClick={makePermalink}>
                {t.permalink}
              </button>
            )}
            <button type="button" onClick={props.onClear}>
              {t.clear}
            </button>
            {permalink && (
              <input
                readOnly
                value={permalink}
                aria-label={t.permalink}
                className={classes.permalink}
                onFocus={(e) => e.currentTarget.select()}
              />
            )}
            {linkError && <span>{t.permalinkError}</span>}
          </div>
          <ol className={classes.queue}>
            {queue.map((item, index) => (
              <li
                key={item.uid}
                className={classes.row}
                data-current={item.uid === currentUid}
                data-over={overIndex === index && dragUid !== null}
                draggable
                onDragStart={() => setDragUid(item.uid)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverIndex(index);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragUid) props.onMove(dragUid, index);
                  setDragUid(null);
                  setOverIndex(null);
                }}
                onDragEnd={() => {
                  setDragUid(null);
                  setOverIndex(null);
                }}
              >
                <span aria-hidden className={classes.grip}>
                  ⠿
                </span>
                <button
                  type="button"
                  onClick={() => props.onPlayItem(item.uid)}
                  className={classes.rowTitle}
                >
                  {item.title}
                  {item.artist && <span className={classes.rowMeta}> · {item.artist}</span>}
                </button>
                {item.duration !== null && (
                  <span className={classes.rowMeta}>{formatTime(item.duration)}</span>
                )}
                <button
                  type="button"
                  aria-label={t.moveUp}
                  disabled={index === 0}
                  onClick={() => props.onMove(item.uid, index - 1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={t.moveDown}
                  disabled={index === queue.length - 1}
                  onClick={() => props.onMove(item.uid, index + 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  aria-label={t.removeFromQueue}
                  onClick={() => props.onRemove(item.uid)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className={classes.bar}>
        <Button variant="outline" size="sm" onClick={props.onTogglePanel} aria-expanded={panelOpen}>
          Queue ({queue.length})
        </Button>
        <div className={classes.now}>
          {now && (
            <>
              <div className={classes.nowTitle}>{now.title}</div>
              <div className={classes.nowArtist}>{now.artist}</div>
              {error ? (
                <div className={classes.nowError} role="alert" title={error}>
                  {fill(t.playbackFailed, { error })}
                </div>
              ) : (
                rendition && <div className={classes.nowArtist}>{rendition}</div>
              )}
            </>
          )}
        </div>

        <div className={classes.controls}>
          <button type="button" onClick={props.onPrev} aria-label={t.previous}>
            ◀◀
          </button>
          <button type="button" onClick={props.onPlayPause} aria-label={playing ? t.pause : t.play}>
            {playing ? '⏸' : '▶'}
          </button>
          <button type="button" onClick={props.onNext} aria-label={t.next}>
            ▶▶
          </button>
        </div>

        <div className={classes.seek}>
          <span className={classes.time}>{formatTime(position)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={Math.min(position, duration || 0)}
            step={1}
            onChange={(e) => props.onSeek(Number(e.target.value))}
            aria-label={t.seek}
          />
          <span className={classes.time}>{formatTime(duration)}</span>
        </div>

        <div className={classes.options}>
          <label className={classes.time}>
            quality{' '}
            <select value={quality} onChange={(e) => props.onQuality(e.target.value)}>
              {qualities.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <span className={classes.time}>vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => props.onVolume(Number(e.target.value))}
            aria-label={t.volume}
            className={classes.volume}
          />
        </div>
      </div>
    </div>
  );
}
