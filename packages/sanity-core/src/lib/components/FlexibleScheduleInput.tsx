// src/lib/components/FlexibleScheduleInput.tsx

import { AddIcon, ChevronDownIcon, ChevronRightIcon, RemoveCircleIcon } from '@sanity/icons';
import { Box, Button, Card, Flex, Stack, Text, TextInput } from '@sanity/ui';
import { useCallback, useState } from 'react';
import type { ObjectInputProps } from 'sanity';
import { set, unset } from 'sanity';

const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;
type Day = (typeof DAYS)[number];

interface ScheduleEntry {
  _key: string;
  label: string;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  day: Day;
  entries: ScheduleEntry[];
}

interface FlexibleScheduleValue {
  schedule?: DaySchedule[];
}

function EntryRow({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: ScheduleEntry;
  onUpdate: (updated: ScheduleEntry) => void;
  onRemove: () => void;
}) {
  return (
    <Flex gap={2} align="center">
      <Box flex={2}>
        <TextInput
          placeholder="Label (e.g. Aikido)"
          value={entry.label ?? ''}
          onChange={(e: any) => onUpdate({ ...entry, label: e.currentTarget.value })}
        />
      </Box>
      <Box flex={1}>
        <TextInput
          type="time"
          value={entry.startTime ?? ''}
          onChange={(e: any) => onUpdate({ ...entry, startTime: e.currentTarget.value })}
        />
      </Box>
      <Text size={1} muted>
        –
      </Text>
      <Box flex={1}>
        <TextInput
          type="time"
          value={entry.endTime ?? ''}
          onChange={(e: any) => onUpdate({ ...entry, endTime: e.currentTarget.value })}
        />
      </Box>
      <Button icon={RemoveCircleIcon} mode="bleed" tone="critical" onClick={onRemove} />
    </Flex>
  );
}

export function FlexibleScheduleInput(props: ObjectInputProps<FlexibleScheduleValue>) {
  const { value, onChange } = props;
  const [openDays, setOpenDays] = useState<Set<Day>>(new Set(['monday']));
  const [showAll, setShowAll] = useState(false);

  const schedule = value?.schedule ?? DAYS.map((day) => ({ day, entries: [] }));

  const patch = useCallback(
    (next: FlexibleScheduleValue | null) => onChange(next ? set(next) : unset()),
    [onChange]
  );

  const getDaySchedule = (day: Day) => schedule.find((s) => s.day === day) ?? { day, entries: [] };

  const updateDay = useCallback(
    (day: Day, entries: ScheduleEntry[]) => {
      const next = DAYS.map((d) => {
        const existing = schedule.find((s) => s.day === d) ?? { day: d, entries: [] };
        return d === day ? { ...existing, entries } : existing;
      });
      patch({ schedule: next });
    },
    [schedule, patch]
  );

  const handleAddEntry = useCallback(
    (day: Day) => {
      const daySchedule = getDaySchedule(day);
      const newEntry: ScheduleEntry = {
        _key: crypto.randomUUID(),
        label: '',
        startTime: '',
        endTime: '',
      };
      updateDay(day, [...daySchedule.entries, newEntry]);
    },
    [schedule, updateDay]
  );

  const handleUpdateEntry = useCallback(
    (day: Day, key: string, updated: ScheduleEntry) => {
      const daySchedule = getDaySchedule(day);
      updateDay(
        day,
        daySchedule.entries.map((e) => (e._key === key ? updated : e))
      );
    },
    [schedule, updateDay]
  );

  const handleRemoveEntry = useCallback(
    (day: Day, key: string) => {
      const daySchedule = getDaySchedule(day);
      updateDay(
        day,
        daySchedule.entries.filter((e) => e._key !== key)
      );
    },
    [schedule, updateDay]
  );

  const toggleDay = useCallback(
    (day: Day) => {
      if (showAll) return;
      setOpenDays((prev) => {
        const next = new Set(prev);
        if (next.has(day)) {
          next.delete(day);
        } else {
          next.clear();
          next.add(day);
        }
        return next;
      });
    },
    [showAll]
  );

  const handleShowAll = useCallback(() => {
    setShowAll((prev) => {
      if (!prev) setOpenDays(new Set(DAYS));
      else setOpenDays(new Set(['monday']));
      return !prev;
    });
  }, []);

  const isDayOpen = (day: Day) => showAll || openDays.has(day);

  return (
    <Stack space={2}>
      <Flex justify="flex-end">
        <Button text={showAll ? 'Collapse all' : 'Show all'} mode="ghost" onClick={handleShowAll} />
      </Flex>
      {DAYS.map((day) => {
        const daySchedule = getDaySchedule(day);
        const isOpen = isDayOpen(day);
        const hasEntries = daySchedule.entries.length > 0;

        return (
          <Card key={day} border radius={2}>
            <Stack>
              <Button
                mode="bleed"
                onClick={() => toggleDay(day)}
                style={{ width: '100%', textAlign: 'left' }}
              >
                <Flex align="center" justify="space-between" padding={3}>
                  <Flex align="center" gap={2}>
                    {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    <Text weight="semibold" style={{ textTransform: 'capitalize' }}>
                      {day}
                    </Text>
                  </Flex>
                  {hasEntries && (
                    <Text size={1} muted>
                      {daySchedule.entries.length}{' '}
                      {daySchedule.entries.length === 1 ? 'entry' : 'entries'}
                    </Text>
                  )}
                </Flex>
              </Button>

              {isOpen && (
                <Box padding={3}>
                  <Stack space={2}>
                    {daySchedule.entries.map((entry) => (
                      <EntryRow
                        key={entry._key}
                        entry={entry}
                        onUpdate={(updated) => handleUpdateEntry(day, entry._key, updated)}
                        onRemove={() => handleRemoveEntry(day, entry._key)}
                      />
                    ))}
                    <Button
                      icon={AddIcon}
                      text={hasEntries ? 'Add another' : 'Add entry'}
                      mode="ghost"
                      tone="primary"
                      onClick={() => handleAddEntry(day)}
                      style={{ width: '100%' }}
                    />
                  </Stack>
                </Box>
              )}
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}
