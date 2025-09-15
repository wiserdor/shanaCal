# Photo Distribution Algorithm

## How Photos Are Distributed Across 14 Months

The new algorithm ensures that photos are distributed as evenly as possible across all 14 months, with any extra photos spread throughout the months rather than all going to the last month.

### Examples:

#### Example 1: 20 Photos

- Base photos per month: `Math.floor(20 / 14) = 1`
- Extra photos: `20 % 14 = 6`
- Distribution:
  - Months 1-6: 2 photos each (1 base + 1 extra)
  - Months 7-14: 1 photo each (1 base + 0 extra)
  - Total: 6×2 + 8×1 = 20 photos

#### Example 2: 30 Photos

- Base photos per month: `Math.floor(30 / 14) = 2`
- Extra photos: `30 % 14 = 2`
- Distribution:
  - Months 1-2: 3 photos each (2 base + 1 extra)
  - Months 3-14: 2 photos each (2 base + 0 extra)
  - Total: 2×3 + 12×2 = 30 photos

#### Example 3: 50 Photos

- Base photos per month: `Math.floor(50 / 14) = 3`
- Extra photos: `50 % 14 = 8`
- Distribution:
  - Months 1-8: 4 photos each (3 base + 1 extra)
  - Months 9-14: 3 photos each (3 base + 0 extra)
  - Total: 8×4 + 6×3 = 50 photos

### Algorithm:

```javascript
const basePhotosPerMonth = Math.floor(totalPhotos / 14);
const extraPhotos = totalPhotos % 14;

for (let i = 0; i < 14; i++) {
  const photosForThisMonth = basePhotosPerMonth + (i < extraPhotos ? 1 : 0);
  const startIndex = i * basePhotosPerMonth + Math.min(i, extraPhotos);
  const endIndex = startIndex + photosForThisMonth;
  const monthPhotos = allPhotos.slice(startIndex, endIndex);
}
```

This ensures that:

1. Each photo is used exactly once
2. Photos are distributed as evenly as possible
3. Extra photos are spread throughout the months, not concentrated at the end
