<script lang="ts" setup>
/* @ts-ignore */ //TS doesn't like the import statement below, but it works as intended
import data from "./src/01_industry.txt?raw";
/**
 * Splits the imported data at newline characters and stores it in the importedData constant.
 */

const importedData = data.split("\n");

/**
 * Stores button codeblocks in a dictionary where the key is the button name and the value is an array of strings containing code.
 */
const codeblocks = ref<{ [key: string]: string[] }>({
  // "buttonName": ["popType = numWorkers", ...]
});

/**
 * A reference to the buttons composable.
 */
const buttons = useButtons();

const scrollSpeed = ref(8);

/**
 * A reference to the currently active button.
 */
const activeButton = buttons.activeButton;

/**
 * A reference to the mode composable.
 */
const mode = useMode();

/**
 * The next mode to be used.
 */
const nextMode = mode.currentMode;

/**
 * A reference to the array of HTML input elements for each corresponding pop type.
 */
const popTypeId = ref([]);

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
 * Parses the imported data and populates the codeblocks dictionary.
 */
const parseData = () => {
  const buttonRegex =
    /(^.*?)(?=\s*=\s*\{)\s*=\s*\{((?:[^{}]*|{(?:[^{}]*|{[^{}]*})*})*)\}/gm;

  let match;
  while ((match = buttonRegex.exec(importedData.join("\n"))) !== null) {
    const buttonName = match[1].trim();
    const codeblock = match[2].split("\n").map((line) => line.trim());
    codeblocks.value[buttonName] = codeblock;
  }
};

/**
 * Returns the number of workers for a given job and button.
 *
 * @param popType - The population type.
 * @param button - The button name.
 * @returns The number of workers for the job.
 */
const getNumWorkersForJob = (popType: string, button: string): number => {
  let numWorkers = 0;
  let numWorkersForJobCodeblock = codeblocks.value[button];
  if (numWorkersForJobCodeblock) {
    for (let i = 0; i < numWorkersForJobCodeblock.length; i++) {
      if (numWorkersForJobCodeblock[i].includes(popType)) {
        numWorkers += parseInt(numWorkersForJobCodeblock[i].split("=")[1]);
      }
    }
  }
  return numWorkers;
};

/**
 * Updates the working group values based on the active button.
 */
const updateWorkingGroup = () => {
  let total = 0;
  for (let i = 0; i < popTypes.value.length; i++) {
    workingGroup.value[popTypes.value[i]] = getNumWorkersForJob(
      popTypes.value[i],
      activeButton.value
    );
    total += workingGroup.value[popTypes.value[i]];
  }
  workingGroup.value.total = total;
};

/**
 * Updates the previous working group values.
 */
const updatePreviousWorkingGroup = () => {
  for (let prop in workingGroup.value) {
    previousWorkingGroup[prop] = workingGroup.value[prop];
  }
};

/**
 * Rounds a number to the nearest 100.
 *
 * @param num - The number to round.
 * @returns The rounded number.
 */
const roundToNearest100 = (num: number) => {
  return Math.round(num / 100) * 100;
};

/**
 * Calculates and returns the total number of workers in the working group.
 *
 * @returns The total number of workers.
 */
const getTotal = (): number => {
  let total = 0;
  for (let it = 0; it < popTypes.value.length; it++) {
    total += workingGroup.value[popTypes.value[it]];
  }
  return total;
};

/**
 * Redistributes the difference between the new and old working group values among the non-zero buckets.
 *
 * @param nonZeroBuckets - The list of non-zero buckets.
 * @param diff - The difference between the new and old working group values.
 * @param increase - Whether to increase or decrease the values.
 */
const redistributeDiff = (
  nonZeroBuckets: string[],
  diff: number,
  increase: boolean
) => {
  for (let i in nonZeroBuckets) {
    let proportion =
      workingGroup.value[nonZeroBuckets[i]] / workingGroup.value.total;
    let adjustment = roundToNearest100(proportion * diff);
    workingGroup.value[nonZeroBuckets[i]] += increase
      ? adjustment
      : -adjustment;
  }
};

/**
 * Adjusts the largest or smallest bucket to account for the remaining difference.
 *
 * @param nonZeroBuckets - The list of non-zero buckets.
 * @param diff - The remaining difference.
 * @param findLargest - Whether to find the largest or smallest bucket.
 */
const adjustLargestOrSmallestBucket = (
  nonZeroBuckets: string[],
  diff: number,
  findLargest: boolean
) => {
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
};

/**
 * Handles a positive difference between the new and old working group values.
 *
 * @param nonZeroBuckets - The list of non-zero buckets.
 * @param diff - The positive difference.
 */
const handlePositiveDiff = (nonZeroBuckets: string[], diff: number) => {
  redistributeDiff(nonZeroBuckets, diff, false);
  if (getTotal() > workingGroup.value.total) {
    diff = getTotal() - workingGroup.value.total;
    adjustLargestOrSmallestBucket(nonZeroBuckets, diff, false);
  }
};

/**
 * Handles a negative difference between the new and old working group values.
 *
 * @param nonZeroBuckets - The list of non-zero buckets.
 * @param diff - The negative difference.
 */

const handleNegativeDiff = (nonZeroBuckets: string[], diff: number) => {
  redistributeDiff(nonZeroBuckets, -diff, true);
  if (getTotal() < workingGroup.value.total) {
    diff = getTotal() - workingGroup.value.total;
    adjustLargestOrSmallestBucket(nonZeroBuckets, diff, true);
  }
};

/**
 * Updates the original codeblock with the new values.
 */
const updateCodeblock = () => {
  for (let i = 0; i < popTypes.value.length; i++) {
    let popType = popTypes.value[i];
    let numWorkers = workingGroup.value[popType];
    let numWorkersForJobCodeblock = codeblocks.value[activeButton.value];
    if (numWorkersForJobCodeblock) {
      for (let j = 0; j < numWorkersForJobCodeblock.length; j++) {
        if (numWorkersForJobCodeblock[j].includes(popType)) {
          numWorkersForJobCodeblock[j] = `${popType}=${numWorkers}`;
        }
      }
    }
  }
};

/**
 * Updates the data based on the changed property.
 *
 * @param changedProperty - The changed property.
 */
const updateData = (changedProperty: string) => {
  let nonZeroBuckets = popTypes.value.filter(
    (popType) => workingGroup.value[popType] > 0 && popType !== changedProperty
  );

  let diff = getTotal() - workingGroup.value.total;

  if (diff > 0) {
    handlePositiveDiff(nonZeroBuckets, diff);
  } else if (diff < 0) {
    handleNegativeDiff(nonZeroBuckets, diff);
  }

  updateCodeblock();
  updateWorkingGroup();
};

const ScrollHorizontal = (event: WheelEvent) => {
  if (!event.currentTarget) return;
  const currentTarget = event.currentTarget as HTMLDivElement;
  currentTarget.scrollLeft += event.deltaY * scrollSpeed.value;
};

const minValue = 0;
const maxValue = 10;
const totalInputWidth = 224;
const thumbHalfWidth = 12;

const sliderLeft = computed(() => {
  return (
    ((scrollSpeed.value - minValue) / (maxValue - minValue)) *
      (totalInputWidth - thumbHalfWidth - thumbHalfWidth) +
    thumbHalfWidth / 2
  );
});

/**
 * Executes the parseData function before the component is mounted.
 */
onBeforeMount(() => {
  parseData();
});

/**
 * Watches for changes in the activeButton value, then updates the working group.
 */
watch(
  () => activeButton.value,
  () => {
    updateWorkingGroup();
  },
  { deep: true }
);
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center">
      <Navbar>
        <div class="flex flex-col">
          <label class="label">Scroll Speed</label>
          <div class="flex flex-col">
            <input
              type="range"
              min="0"
              max="10"
              v-model="scrollSpeed"
              class="range range-secondary w-56"
              step="1"
            />
            <label
              class="label relative"
              :style="`left: ${sliderLeft}px; padding: 0px`"
              >{{ scrollSpeed }}</label
            >
          </div>
        </div>
      </Navbar>
      <div class="flex flex-row w-full">
        <div
          @wheel.prevent="ScrollHorizontal($event)"
          class="my-5 flex flex-col flex-wrap gap-2 max-h-72 overflow-x-scroll scroll-smooth will-change-scroll w-full"
        >
          <div v-for="(codeblock, buttonName) in codeblocks" :key="buttonName">
            <PMButton :buttonName="buttonName" />
          </div>
        </div>
      </div>
      <div class="flex flex-col" v-if="activeButton">
        <form class="form-control flex flex-row flex-wrap my-2 gap-5">
          <label class="input-group input-group-horizontal input-group-xs">
            <span>Total workers for {{ activeButton }}</span>
            <input
              type="text"
              :disabled="nextMode == modes.save ? true : false"
              v-model.number="workingGroup.total"
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
                type="text"
                ref="popTypeId"
                :disabled="nextMode == modes.save ? true : false"
                class="input input-bordered w-20"
                v-model.number.trim.lazy="workingGroup[popType]"
                @focus="updatePreviousWorkingGroup()"
                @change.prevent="updateData(popType)"
                @keyup.enter.prevent="$event.target.blur()"
              />
            </label>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
