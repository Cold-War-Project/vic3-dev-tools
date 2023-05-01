<script lang="ts" setup>
/* @ts-ignore */ //TS doesn't like the import statement below, but it works as intended
import data from "./src/01_industry.txt?raw";
const importedData = data.split("\n");

const codeblocks = ref<{ [key: string]: string[] }>({
  // "buttonName": ["popType = numWorkers", ...]
});

const buttons = useButtons();
const activeButton = buttons.activeButton;

const mode = useMode();
const nextMode = mode.currentMode;

const popTypeId = ref([]);

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

const parseData = () => {
  // Reset the codeblocks variable
  let numberOpenBrackets = 0;
  let numberClosedBrackets = 0;
  let codeblockStartLine = 0;
  let codeblockEndLine = 0;

  for (let i = 0; i < importedData.length; i++) {
    if (importedData[i].includes("{")) {
      numberOpenBrackets++;
      if (numberOpenBrackets === 1) {
        codeblockStartLine = i;
      }
    }
    if (importedData[i].includes("}")) {
      numberClosedBrackets++;
      if (numberClosedBrackets === numberOpenBrackets) {
        codeblockEndLine = i;
        const buttonName = importedData[codeblockStartLine].trim();
        const codeblock = importedData.slice(
          codeblockStartLine + 1,
          codeblockEndLine
        );
        codeblocks.value[buttonName] = codeblock;
        numberOpenBrackets = 0;
        numberClosedBrackets = 0;
      }
    }
  }
};

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

const updatePreviousWorkingGroup = () => {
  for (let prop in workingGroup.value) {
    previousWorkingGroup[prop] = workingGroup.value[prop];
  }
};

// EXAMPLE I/O
//  buckets
//  3 3 2 2
//  subtract 2 from the last bucket 2->0
//  3 3 2 -> total should be 10
//  diff = 2
//  3 -> 3 + (3/10)*2 = 345 -> 300
//  3 -> 2
//  2 -> 2 - (2/10)*2 = 2.4 -> 2

//  remainder  -> 200

//  4 4 2

//  example  2
//  3 3 3 2 2 2 = 15
//  2 -> 0
//  3 3 3 2 2 0

//  -----

//  3 3 3 2 23
//  20 -> 0
//  4 4 4 3
//  5 5 5 4
//  6 6 6 5
//  7 7 7 6
//  8 8 8 7

//  diff / total buckets -> 5 remainder 3

const roundToNearest100 = (num: number) => {
  return Math.round(num / 100) * 100;
};

const getTotal = (): number => {
  let total = 0;
  for (let it = 0; it < popTypes.value.length; it++) {
    total += workingGroup.value[popTypes.value[it]];
  }
  return total;
};

const updateData = (changedProperty: string) => {
  let nonZeroBuckets = popTypes.value.filter(
    (popType) => workingGroup.value[popType] > 0 && popType !== changedProperty
  );
  console.log(`changedProperty: ${changedProperty}`);
  console.log(`nonZeroBuckets:`);
  console.log(nonZeroBuckets);
  console.log(`previousWorkingGroup:`);
  console.log(previousWorkingGroup);
  // Add up all the inputs to get a temporary new total
  // If the new total is greater than the previous total, we need to distribute the difference proportionally to all the buckets
  if (getTotal() > workingGroup.value.total) {
    console.log(`total was greater than previous total:`);
    console.log(getTotal());
    let diff = getTotal() - workingGroup.value.total;
    console.log(`diff: ${diff}`);

    for (let i in nonZeroBuckets) {
      let proportion =
        workingGroup.value[nonZeroBuckets[i]] / workingGroup.value.total;
      console.log(`getting proportion for ${nonZeroBuckets[i]}`);
      console.log(`proportion: ${proportion}`);
      console.log(`diff * proportion: ${diff * proportion}`);
      console.log(`roundToNearest100(diff * proportion):`);
      console.log(roundToNearest100(diff * proportion));
      workingGroup.value[nonZeroBuckets[i]] -= roundToNearest100(
        proportion * diff
      );
    }
    console.log(`workingGroup:`);
    console.log(workingGroup.value);
    // Recompute the new total and recheck if it's greater than the previous total
    // If it's still greater than the previous total, we should remove the difference from the smallest bucket
    if (getTotal() > workingGroup.value.total) {
      console.log(`total was still greater than previous total:`);
      console.log(getTotal());
      // Recompute the diff based on recomputed newTotal
      diff = getTotal() - workingGroup.value.total;
      console.log(`diff: ${diff}`);
      let smallest: string = "";
      for (let i in nonZeroBuckets) {
        if (i === "total") {
          continue;
        }
        if (smallest == "") {
          smallest = nonZeroBuckets[i];
        } else if (
          workingGroup.value[nonZeroBuckets[i]] < workingGroup.value[smallest]
        ) {
          smallest = nonZeroBuckets[i];
        }
      }
      console.log(`smallest: ${smallest}`);
      workingGroup.value[smallest] -= diff;
      console.log(`workingGroup:`);
      console.log(workingGroup.value);
    }
  }

  // If the new total is less than the previous total, we need to distribute the difference proportionally to all the buckets
  // Do the inverse of the above
  if (getTotal() < workingGroup.value.total) {
    console.log(`total was greater than previous total:`);
    console.log(getTotal());
    let diff = getTotal() - workingGroup.value.total;
    console.log(`diff: ${diff}`);
    for (let i in nonZeroBuckets) {
      let proportion =
        workingGroup.value[nonZeroBuckets[i]] / workingGroup.value.total;
      console.log(`getting proportion for ${nonZeroBuckets[i]}`);
      console.log(`proportion: ${proportion}`);
      console.log(`diff * proportion: ${diff * proportion}`);
      console.log(`roundToNearest100(diff * proportion):`);
      console.log(roundToNearest100(diff * proportion));
      workingGroup.value[nonZeroBuckets[i]] -= roundToNearest100(
        proportion * diff
      );
    }
    console.log(`workingGroup:`);
    console.log(workingGroup.value);

    if (getTotal() < workingGroup.value.total) {
      diff = getTotal() - workingGroup.value.total;
      console.log(`diff: ${diff}`);
      let largest: string = "";
      for (let i in nonZeroBuckets) {
        if (i === "total") {
          continue;
        }
        if (largest == "") {
          largest = nonZeroBuckets[i];
        } else if (
          workingGroup.value[nonZeroBuckets[i]] > workingGroup.value[largest]
        ) {
          largest = nonZeroBuckets[i];
        }
      }
      console.log(`largest: ${largest}`);
      workingGroup.value[largest] -= diff;
      console.log(`workingGroup:`);
      console.log(workingGroup.value);
    }
  }

  // update the original codeblock with the new values
  for (let i = 0; i < popTypes.value.length; i++) {
    let popType = popTypes.value[i];
    let numWorkers = workingGroup.value[popType];
    let numWorkersForJobCodeblock = codeblocks.value[activeButton.value];
    if (numWorkersForJobCodeblock) {
      for (let i = 0; i < numWorkersForJobCodeblock.length; i++) {
        if (numWorkersForJobCodeblock[i].includes(popType)) {
          numWorkersForJobCodeblock[i] = `${popType}=${numWorkers}`;
        }
      }
    }
  }
  // Update the display for the user by pulling the values from the codeblock
  updateWorkingGroup();
};

onBeforeMount(() => {
  parseData();
});

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
