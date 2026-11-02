// src/lib/components/FlexibleDateInput.tsx

import { AddIcon, RemoveCircleIcon } from '@sanity/icons';
import { Box, Button, Card, Flex, Stack, Switch, Text, TextInput } from '@sanity/ui';
import { useCallback, useState } from 'react';
import type { ObjectInputProps } from 'sanity';
import { set, unset } from 'sanity';

interface DateEntry {
  _key: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  description?: string;
}

interface FlexibleDateValue {
  circa?: boolean;
  entries?: DateEntry[];
  isRange?: boolean;
}

interface FlexibleDateInputProps extends ObjectInputProps<FlexibleDateValue> {
  showCirca?: boolean;
}

function formatDateSummary(entry: DateEntry): string {
  if (!entry.date) return 'New date';
  const date = new Date(entry.date + 'T00:00:00');
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  if (entry.allDay) return `${formatted} · All day`;
  if (entry.startTime && entry.endTime) return `${formatted} · ${entry.startTime}–${entry.endTime}`;
  if (entry.startTime) return `${formatted} · ${entry.startTime}`;
  return formatted;
}

function TimeInputs({
  startTime,
  endTime,
  onChange,
}: {
  startTime?: string;
  endTime?: string;
  onChange: (start: string, end: string) => void;
}) {
  return (
    <Flex gap={2} align="center">
      <TextInput
        type="time"
        value={startTime ?? ''}
        onChange={(e: any) => onChange(e.currentTarget.value, endTime ?? '')}
      />
      <Text size={1} muted>
        to
      </Text>
      <TextInput
        type="time"
        value={endTime ?? ''}
        onChange={(e: any) => onChange(startTime ?? '', e.currentTarget.value)}
      />
    </Flex>
  );
}

function DateRow({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: DateEntry;
  onUpdate: (updated: DateEntry) => void;
  onRemove: () => void;
}) {
  const [includeTime, setIncludeTime] = useState(!!(entry.startTime || entry.endTime));
  const [showDescription, setShowDescription] = useState(!!entry.description);

  const handleAllDayChange = useCallback(
    (e: any) => {
      const allDay = e.currentTarget.checked;
      if (allDay) {
        setIncludeTime(false);
        onUpdate({ ...entry, allDay: true, startTime: undefined, endTime: undefined });
      } else {
        onUpdate({ ...entry, allDay: false });
      }
    },
    [entry, onUpdate]
  );

  const handleIncludeTimeChange = useCallback(
    (e: any) => {
      const include = e.currentTarget.checked;
      setIncludeTime(include);
      if (!include) {
        onUpdate({ ...entry, startTime: undefined, endTime: undefined, allDay: false });
      }
    },
    [entry, onUpdate]
  );

  return (
    <Card padding={3} radius={2} border>
      <Stack space={3}>
        <Flex justify="space-between" align="center">
          <Text size={1} weight="semibold" muted>
            {formatDateSummary(entry)}
          </Text>
          <Button icon={RemoveCircleIcon} mode="bleed" tone="critical" onClick={onRemove} />
        </Flex>

        <TextInput
          type="date"
          value={entry.date ?? ''}
          onChange={(e: any) => onUpdate({ ...entry, date: e.currentTarget.value })}
        />

        <Flex gap={3} align="center">
          <Flex gap={2} align="center">
            <Switch checked={includeTime} onChange={handleIncludeTimeChange} />
            <Text size={1}>Include time?</Text>
          </Flex>
          {includeTime && (
            <Flex gap={2} align="center">
              <Switch checked={entry.allDay ?? false} onChange={handleAllDayChange} />
              <Text size={1}>All day</Text>
            </Flex>
          )}
        </Flex>

        {includeTime && !entry.allDay && (
          <TimeInputs
            startTime={entry.startTime}
            endTime={entry.endTime}
            onChange={(start, end) => onUpdate({ ...entry, startTime: start, endTime: end })}
          />
        )}

        {showDescription ? (
          <TextInput
            placeholder="Description"
            value={entry.description ?? ''}
            onChange={(e: any) => onUpdate({ ...entry, description: e.currentTarget.value })}
          />
        ) : (
          <Button
            icon={AddIcon}
            text="Add description"
            mode="bleed"
            onClick={() => setShowDescription(true)}
          />
        )}
      </Stack>
    </Card>
  );
}

export function FlexibleDateInput(props: FlexibleDateInputProps) {
  const { value, onChange, readOnly, showCirca = true } = props;

  const patch = useCallback(
    (next: FlexibleDateValue | null) => onChange(next ? set(next) : unset()),
    [onChange]
  );

  const entries = value?.entries ?? [];
  const rangeEntry = entries[0];

  const handleAddEntry = useCallback(() => {
    const newEntry: DateEntry = { _key: crypto.randomUUID(), date: '' };
    patch({ ...value, entries: [...entries, newEntry] });
  }, [value, entries, patch]);

  const handleUpdateEntry = useCallback(
    (key: string, updated: DateEntry) => {
      patch({
        ...value,
        entries: entries.map((e) => (e._key === key ? updated : e)),
      });
    },
    [value, entries, patch]
  );

  const handleRemoveEntry = useCallback(
    (key: string) => {
      patch({ ...value, entries: entries.filter((e) => e._key !== key) });
    },
    [value, entries, patch]
  );

  const handleCircaChange = useCallback(
    (e: any) => patch({ ...value, circa: e.currentTarget.checked }),
    [value, patch]
  );

  const handleRangeChange = useCallback(
    (e: any) => patch({ ...value, isRange: e.currentTarget.checked, entries: entries.slice(0, 1) }),
    [value, patch]
  );

  return (
    <Stack space={3}>
      <Flex gap={3} align="center">
        <Flex gap={2} align="center">
          <Switch
            checked={value?.isRange ?? false}
            onChange={handleRangeChange}
            disabled={readOnly}
          />
          <Text size={1}>Date range</Text>
        </Flex>
        {showCirca && (
          <Flex gap={2} align="center">
            <Switch
              checked={value?.circa ?? false}
              onChange={handleCircaChange}
              disabled={readOnly}
            />
            <Text size={1}>Circa</Text>
          </Flex>
        )}
      </Flex>

      {value?.isRange ? (
        <Flex gap={2} align="center">
          <Box flex={1}>
            <TextInput
              type="date"
              value={rangeEntry?.date ?? ''}
              onChange={(e: any) =>
                patch({
                  ...value,
                  entries: [
                    {
                      _key: rangeEntry?._key ?? crypto.randomUUID(),
                      date: e.currentTarget.value,
                      endDate: rangeEntry?.endDate,
                    },
                  ],
                })
              }
            />
          </Box>
          <Text size={1} muted>
            to
          </Text>
          <Box flex={1}>
            <TextInput
              type="date"
              value={rangeEntry?.endDate ?? ''}
              onChange={(e: any) =>
                patch({
                  ...value,
                  entries: [
                    {
                      _key: rangeEntry?._key ?? crypto.randomUUID(),
                      date: rangeEntry?.date ?? '',
                      endDate: e.currentTarget.value,
                    },
                  ],
                })
              }
            />
          </Box>
        </Flex>
      ) : (
        <Stack space={3}>
          {entries.map((entry) => (
            <DateRow
              key={entry._key}
              entry={entry}
              onUpdate={(updated) => handleUpdateEntry(entry._key, updated)}
              onRemove={() => handleRemoveEntry(entry._key)}
            />
          ))}
          <Button
            icon={AddIcon}
            text={entries.length > 0 ? 'Add another date' : 'Add date'}
            mode="ghost"
            tone="primary"
            onClick={handleAddEntry}
            style={{ width: '100%' }}
            disabled={readOnly}
          />
        </Stack>
      )}
    </Stack>
  );
}
