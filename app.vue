<script lang="ts" setup>
/**
 * Splits the imported data at newline characters and stores it in the importedData constant.
 */

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
enum PopType {
  Academics = "academics",
  Administrators = "administrators",
  Artisans = "artisans",
  Clergy = "clergy",
  Engineers = "engineers",
  Executives = "executives",
  InformalWorkers = "informal_workers",
  Investors = "investors",
  Laborers = "laborers",
  Managers = "managers",
  Officers = "officers",
  Professionals = "professionals",
  ServiceWorkers = "service_workers",
  Servicemembers = "servicemembers",
  Technicians = "technicians",
}

const popTypes = ref(Object.values(PopType));

type WorkingGroup = {
  [key in PopType]: number;
} & {
  [key: string]: number;
};

/**
 * Stores the previous working group values.
 */
let previousWorkingGroup: WorkingGroup = Object.fromEntries(
  Object.values(PopType).map((key) => [key, 0])
) as WorkingGroup;

/**
 * A reference to the current working group values.
 */
const workingGroup = ref<WorkingGroup>(
  Object.fromEntries(
    Object.values(PopType).map((key) => [key, 0])
  ) as WorkingGroup
);
/**
 * Parses the imported data and populates the codeblocks dictionary.
 */
const parseData = (rawData: string) => {
  // Regex pattern to match the button names and their corresponding code blocks
  const regexPattern = /(\S+)\s*\{([\s\S]*?)\}/g;

  // Iterate through all matches in the rawData
  let match;
  while ((match = regexPattern.exec(rawData)) !== null) {
    const buttonName = match[1].trim();
    const codeBlock = match[2]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    codeblocks.value[buttonName] = codeBlock;
  }
};

/**
 * Returns the number of workers for a given job and button.
 *
 * @param popType - The population type.
 * @param button - The button name.
 * @returns The number of workers for the job.
 */
const getNumWorkersForJob = (popType: PopType, button: string): number => {
  let numWorkers = 0;
  const numWorkersForJobCodeblock = codeblocks.value[button];

  if (numWorkersForJobCodeblock) {
    for (const line of numWorkersForJobCodeblock) {
      if (line.includes(popType)) {
        numWorkers += parseInt(line.split("=")[1]);
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
  return popTypes.value.reduce(
    (total, popType) => total + workingGroup.value[popType],
    0
  );
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
 * Handles the case where the new working group value is greater than the old working group value.
 * @param nonZeroBuckets Array of non-zero buckets from the working group.
 * @param diff Remaining difference between the new and old working group values.
 */
const handlePositiveDiff = (nonZeroBuckets: PopType[], diff: number) => {
  redistributeDiff(nonZeroBuckets, diff, false);

  const total = getTotal();

  if (total > workingGroup.value.total) {
    adjustLargestOrSmallestBucket(
      nonZeroBuckets,
      total - workingGroup.value.total,
      false
    );
  }
};

/**
 * Handles the case where the new working group value is less than the old working group value.
 * @param nonZeroBuckets Array of non-zero buckets from the working group.
 * @param diff Remaining difference between the new and old working group values.
 */
const handleNegativeDiff = (nonZeroBuckets: PopType[], diff: number) => {
  redistributeDiff(nonZeroBuckets, -diff, true);

  const total = getTotal();

  if (total < workingGroup.value.total) {
    adjustLargestOrSmallestBucket(
      nonZeroBuckets,
      workingGroup.value.total - total,
      true
    );
  }
};

/**
 * Updates the original codeblock with the new values.
 */
const updateCodeblock = () => {
  for (let popType of popTypes.value) {
    let numWorkers = workingGroup.value[popType];
    let numWorkersForJobCodeblock = codeblocks.value[activeButton.value];

    if (numWorkersForJobCodeblock) {
      let index = numWorkersForJobCodeblock.findIndex((line) =>
        line.includes(popType)
      );

      if (index !== -1) {
        numWorkersForJobCodeblock[index] = `${popType}=${numWorkers}`;
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

async function fetchData() {
  const response = await fetch("./src/01_industry.txt");
  const data = await response.text();
  return data;
}

/**
 * Executes the parseData function before the component is mounted.
 */
onBeforeMount(async () => {
  const rawData = await fetchData();
  parseData(rawData);
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
      <Navbar class="w-full" />
      <div
        class="my-5 flex flex-col flex-wrap gap-2 max-h-72 overflow-x-scroll scroll-smooth will-change-scroll w-full"
      >
        <div v-for="(codeblock, buttonName) in codeblocks" :key="buttonName">
          <PMButton :buttonName="buttonName" />
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
