<script setup lang="ts">
const { codeblocks } = useCodeblocks();
const { activeButton } = useButtons();
const { currentMode } = useMode();
/**
 * A reference to the array of HTML input elements for each corresponding pop type.
 */
const popTypeInputId = ref([]);

/**
 * A reference to the array of population types.
 */
const popTypes = ref([
  "academics",
  "administrators",
  "artisans",
  "clergy",
  "engineers",
  "executives",
  "informal_workers",
  "investors",
  "laborers",
  "managers",
  "officers",
  "professionals",
  "service_workers",
  "servicemembers",
  "technicians",
]);

/**
 * Describes the structure of a working group.
 */
interface WorkingGroup {
  academics: number;
  administrators: number;
  artisans: number;
  clergy: number;
  engineers: number;
  executives: number;
  informal_workers: number;
  investors: number;
  laborers: number;
  managers: number;
  officers: number;
  professionals: number;
  service_workers: number;
  servicemembers: number;
  technicians: number;
  total: number;
  [key: string]: number;
}

/**
 * Stores the previous working group values.
 */
let previousWorkingGroup: WorkingGroup = {
  academics: 0,
  administrators: 0,
  artisans: 0,
  clergy: 0,
  engineers: 0,
  executives: 0,
  informal_workers: 0,
  investors: 0,
  laborers: 0,
  managers: 0,
  officers: 0,
  professionals: 0,
  service_workers: 0,
  servicemembers: 0,
  technicians: 0,
  total: 0,
};

/**
 * A reference to the current working group values.
 */
const workingGroup = ref<WorkingGroup>({
  academics: 0,
  administrators: 0,
  artisans: 0,
  clergy: 0,
  engineers: 0,
  executives: 0,
  informal_workers: 0,
  investors: 0,
  laborers: 0,
  managers: 0,
  officers: 0,
  professionals: 0,
  service_workers: 0,
  servicemembers: 0,
  technicians: 0,
  total: 0,
});
/**
 * Returns the number of workers for a given job and button.
 *
 * @param popType - The population type.
 * @returns The number of workers for the job.
 * @type number - The number of workers for the job.
 */
function getNumWorkersForJob(popType: string, codeblock: string[]): number {
  // Find the line in the codeblock whose key matches the population type
  const line = codeblock.find((line) => line.includes(popType));
  // If the line exists, return the number on the right side of the equals sign, otherwise return 0
  return line ? parseInt(line.split("=")[1].trim()) : 0;
}

/**
 * Updates the working group values based on the active button.
 */
function updateWorkingGroup() {
  let total = 0;
  let codeblock = codeblocks.value[activeButton.value];
  for (let i = 0; i < popTypes.value.length; i++) {
    workingGroup.value[popTypes.value[i]] = getNumWorkersForJob(
      popTypes.value[i],
      codeblock
    );
    total += workingGroup.value[popTypes.value[i]];
  }
  workingGroup.value.total = total;
}

/**
 * Updates the previous working group values.
 */
function updatePreviousWorkingGroup() {
  for (let prop in workingGroup.value) {
    previousWorkingGroup[prop] = workingGroup.value[prop];
  }
}

/**
 * Rounds a number to the nearest 100.
 *
 * @param num - The number to round.
 * @returns The rounded number.
 */
const roundToNearest100 = (num: number): number => Math.round(num / 100) * 100;

/**
 * Calculates and returns the total number of workers in the working group.
 * @returns  The total number of workers.
 */
function getTotal(): number {
  let total = 0;
  for (let i = 0; i < popTypes.value.length; i++) {
    total += workingGroup.value[popTypes.value[i]];
  }
  return total;
}

function getNonZeroBuckets(filter: string): string[] {
  return popTypes.value.filter(
    (popType) => workingGroup.value[popType] > 0 && popType !== filter
  );
}

/**
 * Redistributes the difference between the new and old working group values among the non-zero buckets.
 * @param changedProperty - A unique key tied to the property that changed, referring to an input field in the UI for a population type.
 * @param diff - The difference between the new and old working group values.
 * @param increase - Whether to increase or decrease the values.
 */
function redistributeDiff(
  changedProperty: string,
  diff: number,
  increase: boolean
): void {
  let nonZeroBuckets = getNonZeroBuckets(changedProperty);
  for (let i in nonZeroBuckets) {
    let proportion =
      workingGroup.value[nonZeroBuckets[i]] / workingGroup.value.total;
    let adjustment = roundToNearest100(proportion * diff);
    workingGroup.value[nonZeroBuckets[i]] += increase
      ? adjustment
      : -adjustment;
  }
}

/**
 * Adjusts the largest or smallest bucket to account for the remaining difference.
 * @param diff - The remaining difference.
 * @param findLargest - Whether to find the largest or smallest bucket.
 */
function adjustLargestOrSmallestBucket(
  changedProperty: string,
  diff: number,
  findLargest: boolean
) {
  let nonZeroBuckets = getNonZeroBuckets(changedProperty);
  let targetBucket: string = "";

  for (let i in nonZeroBuckets) {
    if (i === "total") {
      continue;
    }
    if (targetBucket === "") {
      targetBucket = nonZeroBuckets[i];
    } else {
      let currentCondition =
        workingGroup.value[nonZeroBuckets[i]] >
        workingGroup.value[targetBucket];
      let targetCondition = findLargest ? currentCondition : !currentCondition;

      if (targetCondition) {
        targetBucket = nonZeroBuckets[i];
      }
    }
  }
  workingGroup.value[targetBucket] -= diff;
}

/**
 * Handles a positive difference between the new and old working group values.
 * @param changedProperty - A unique key tied to the property that changed, referring to an input field in the UI for a population type.
 * @param diff - The positive difference.
 */
function handlePositiveDiff(changedProperty: string, diff: number) {
  redistributeDiff(changedProperty, diff, false);
  if (getTotal() > workingGroup.value.total) {
    diff = getTotal() - workingGroup.value.total;
    adjustLargestOrSmallestBucket(changedProperty, diff, false);
  }
}

/**
 * Handles a negative difference between the new and old working group values.
 * @param changedProperty - A unique key tied to the property that changed, referring to an input field in the UI for a population type.
 * @param diff - The negative difference.
 */
function handleNegativeDiff(changedProperty: string, diff: number) {
  redistributeDiff(changedProperty, diff, true);
  if (getTotal() < workingGroup.value.total) {
    diff = getTotal() - workingGroup.value.total;
    adjustLargestOrSmallestBucket(changedProperty, diff, true);
  }
}

interface LineObject {
  line: string | undefined;
  property: string;
}

/**
 * Finds lines in the codeblock that include the changed properties.
 */
function findLinesToUpdate(
  changedProperties: string[],
  codeblock: string[]
): LineObject[] {
  return changedProperties.map((changedProperty) => ({
    line: codeblock.find((line) => line.includes(changedProperty)),
    property: changedProperty,
  }));
}

/**
 * Updates the lines in the codeblock with the new values from the working group.
 */
function updateLines(codeblock: string[], linesToUpdate: LineObject[]): void {
  linesToUpdate.forEach(({ line, property }) => {
    if (!line) return;

    const index = codeblock.indexOf(line);

    if (index > -1) {
      codeblock[index] = line.replace(
        /(\d+)/,
        workingGroup.value[property].toString()
      );
    }
  });
}

/**
 * Updates the original codeblock with the new values.
 */
function updateCodeblock(changedProperties: string[]): void {
  const codeblockToUpdate = codeblocks.value[activeButton.value];

  if (codeblockToUpdate) {
    const linesToUpdate = findLinesToUpdate(
      changedProperties,
      codeblockToUpdate
    );
    updateLines(codeblockToUpdate, linesToUpdate);
  }

  updateWorkingGroup();
}

/**
 * Updates the data based on the changed property.
 * @param changedProperty - The changed property.
 */
function updateData(changedProperty: string) {
  let diff = getTotal() - workingGroup.value.total;

  if (diff > 0) {
    handlePositiveDiff(changedProperty, diff);
  } else if (diff < 0) {
    handleNegativeDiff(changedProperty, diff);
  }

  const changedProperties = [changedProperty].concat(
    getNonZeroBuckets(changedProperty)
  );

  updateCodeblock(changedProperties);
}

//Takes the codeblocks data, puts it all together into a single string saves it as a text file in ~/public/data/out/
async function saveDataToOriginalFile() {
  let newData = "";
  for (let i in codeblocks.value) {
    newData += codeblocks.value[i].join("\n") + "\n";
  }

  const formData = new FormData();
  const file = new File([newData], "01_industry.txt", { type: "text/plain" });
  formData.append("file", file);

  try {
    const { error } = await useFetch("/data/out/01_industry.txt", {
      method: "PUT",
      body: formData,
      baseURL: "http://localhost:3001",
    });
    if (error.value) {
      console.error(error.value);
    }
  } catch (error: any | unknown) {
    console.error(error);
  }
}

watch(
  () => activeButton.value,
  () => {
    updateWorkingGroup();
  },
  { deep: true }
);

watch(
  () => currentMode.value,
  () => {
    if (currentMode.value === modes.save) saveDataToOriginalFile();
    updateWorkingGroup();
  },
  { deep: true }
);
</script>

<template>
  <div class="flex flex-col">
    <form class="form-control flex flex-row flex-wrap my-2 gap-5">
      <label class="input-group input-group-horizontal input-group-xs">
        <span>Total workers for {{ activeButton }}</span>
        <input
          type="number"
          :disabled="nextMode == modes.save ? true : false"
          v-model.number.lazy="workingGroup.total"
          class="input input-bordered"
        />
      </label>
      <div
        class="flex flex-col"
        v-for="(popType, index) in popTypes"
        :key="index"
      >
        <label
          class="input-group input-group-horizontal input-group-xs self-end"
        >
          <span>{{ popType }}</span>
          <input
            type="number"
            ref="popTypeInputId"
            :disabled="nextMode == modes.save ? true : false"
            class="input input-bordered w-20 transition ease-in-out duration-300 focus:input-secondary"
            v-model.number.trim.lazy="workingGroup[popType]"
            @focus="updatePreviousWorkingGroup()"
            @change.prevent="updateData(popType)"
            @keyup.enter.prevent="$event.target.blur()"
          />
        </label>
      </div>
    </form>
  </div>
</template>
