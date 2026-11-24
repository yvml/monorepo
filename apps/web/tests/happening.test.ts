// apps/web/tests/happening.test.ts
import { describe, expect, it } from 'vitest';
import { isHappening, localMoment } from '../src/lib/dates';
import { describeWeather } from '../src/lib/weather';

type Item = { date: string; endDate?: string; startTime?: string; endTime?: string; allDay?: boolean };
const entry = (items: Item[], isRange = false) =>
  ({ dateTime: { isRange, entries: items.map((item, index) => ({ _key: String(index), ...item })) } }) as Parameters<
    typeof isHappening
  >[0];

describe('localMoment', () => {
  it('reads the day and time in the lab zone, not UTC', () => {
    // 02:30 UTC on the 15th is the evening of the 14th in California (PDT, UTC-7).
    expect(localMoment(new Date('2026-10-15T02:30:00Z'), 'America/Los_Angeles')).toEqual({ day: '2026-10-14', time: '19:30' });
  });

  it('writes midnight as 00:00', () => {
    expect(localMoment(new Date('2026-10-15T07:00:00Z'), 'America/Los_Angeles').time).toBe('00:00');
  });
});

describe('isHappening', () => {
  it('covers the whole day when a date has no times', () => {
    expect(isHappening(entry([{ date: '2026-10-14' }]), '2026-10-14', '23:59')).toBe(true);
    expect(isHappening(entry([{ date: '2026-10-14' }]), '2026-10-15', '09:00')).toBe(false);
  });

  it('holds to the times of a date', () => {
    const workshop = entry([{ date: '2026-10-14', startTime: '10:00', endTime: '13:00' }]);
    expect(isHappening(workshop, '2026-10-14', '09:59')).toBe(false);
    expect(isHappening(workshop, '2026-10-14', '10:00')).toBe(true);
    expect(isHappening(workshop, '2026-10-14', '12:59')).toBe(true);
    expect(isHappening(workshop, '2026-10-14', '13:00')).toBe(false);
  });

  it('treats an all-day date as the whole day even with times', () => {
    expect(isHappening(entry([{ date: '2026-10-14', startTime: '10:00', endTime: '11:00', allDay: true }]), '2026-10-14', '20:00')).toBe(true);
  });

  it('covers every day of a range', () => {
    const show = entry([{ date: '2026-10-10', endDate: '2026-10-20' }], true);
    expect(isHappening(show, '2026-10-15', '12:00')).toBe(true);
    expect(isHappening(show, '2026-10-21', '12:00')).toBe(false);
  });

  it('finds any of several separate dates', () => {
    const series = entry([{ date: '2026-10-07' }, { date: '2026-10-14' }]);
    expect(isHappening(series, '2026-10-14', '12:00')).toBe(true);
    expect(isHappening(series, '2026-10-10', '12:00')).toBe(false);
  });

  it('is false for an entry with no dates', () => {
    expect(isHappening({ dateTime: null }, '2026-10-14', '12:00')).toBe(false);
  });
});

describe('describeWeather', () => {
  it('says sunny by day and clear at night for a clear sky', () => {
    expect(describeWeather(0, true)).toEqual({ condition: 'weatherSunny', icon: 'sun' });
    expect(describeWeather(0, false)).toEqual({ condition: 'weatherClear', icon: 'moon' });
  });

  it('maps the other codes to a condition', () => {
    expect(describeWeather(3, true).condition).toBe('weatherCloudy');
    expect(describeWeather(45, true).condition).toBe('weatherFog');
    expect(describeWeather(61, true).condition).toBe('weatherRain');
    expect(describeWeather(73, true).condition).toBe('weatherSnow');
    expect(describeWeather(95, true).condition).toBe('weatherStorm');
  });
});
