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
  console.log(`data is being parsed`);
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

// Makes the color the input box matching the invalidValue red when called
const valueIsInvalid = (invalidValue: string) => {
  const inputBox = document.getElementById(invalidValue);
  if (inputBox) {
    inputBox.style.backgroundColor = "red";
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
  console.log(`updating working group`);
  let total = 0;
  for (let i = 0; i < popTypes.value.length; i++) {
    workingGroup.value[popTypes.value[i]] = getNumWorkersForJob(
      popTypes.value[i],
      activeButton.value
    );
    total += workingGroup.value[popTypes.value[i]];
  }
  workingGroup.value.total = total;
  console.log(popTypeId.value);
};

const updatePreviousWorkingGroup = () => {
  console.log(`updating previous working group`);
  for (let prop in workingGroup.value) {
    previousWorkingGroup[prop] = workingGroup.value[prop];
  }
  console.log(previousWorkingGroup);
};

const updateData = (changedProperty: string) => {
  if (changedProperty == "" || changedProperty == null) {
    return;
  }
  // for the changedProperty, grab the old value from the previousWorkingGroup and the new value from the workingGroup object
  const oldValue = previousWorkingGroup[changedProperty];
  const newValue = workingGroup.value[changedProperty];

  //get the property names of all the non-zero properties in the workingGroup object also excluding the total property and the changed property
  const nonZeroProperties = Object.keys(workingGroup.value).filter(
    (key) =>
      workingGroup.value[key] !== 0 &&
      key !== "total" &&
      key !== changedProperty
  );

  if (nonZeroProperties.length === 0) {
    return;
  }

  //get the difference of the old and new values
  let difference = newValue - oldValue;
  console.log(`difference is ${difference}`);
  let differencePerProperty: number = Math.floor(
    difference / nonZeroProperties.length
  );
  let differenceRemainder = difference % nonZeroProperties.length;

  //if the difference is positive, then the value of the changedProperty has increased. Divide the difference by the number of non-zero properties and subtract that value from each non-zero property
  if (difference > 0) {
    for (let i = 0; i < nonZeroProperties.length; i++) {
      if (
        (workingGroup.value[nonZeroProperties[i]] -= differencePerProperty) <= 0
      ) {
        valueIsInvalid(nonZeroProperties[i]);
        return;
      }
      workingGroup.value[nonZeroProperties[i]] -= differencePerProperty;
    }
  } else if (difference < 0) {
    for (let j = 0; j < nonZeroProperties.length; j++) {
      if (
        (workingGroup.value[nonZeroProperties[j]] -= differencePerProperty) <=
        workingGroup.value.total
      ) {
        valueIsInvalid(nonZeroProperties[j]);
        return;
      }
      workingGroup.value[nonZeroProperties[j]] -= differencePerProperty;
    }
  } else {
    return;
  }

  // If the differenceRemainder isn't equal to 0, then add the remainder to the largest non-zero property
  if (differenceRemainder !== 0) {
    let largestNonZeroProperty = nonZeroProperties[0];
    for (let k = 0; k < nonZeroProperties.length; k++) {
      if (
        workingGroup.value[nonZeroProperties[k]] >
        workingGroup.value[largestNonZeroProperty]
      ) {
        largestNonZeroProperty = nonZeroProperties[k];
      }
    }
    workingGroup.value[largestNonZeroProperty] += differenceRemainder;
  }

  //Double check that the total is still equal workingGroup.total, if it isn't throw an error
  let total = 0;
  for (let prop in workingGroup.value) {
    if (prop !== "total") total += workingGroup.value[prop];
    else continue;
  }
  if (total !== workingGroup.value.total) {
    console.error(
      `total of workingGroup is not equal to workingGroup.total, something went wrong`
    );
  }

  //save the modified workingGroup data to the codeblocks array
  const codeblock = codeblocks.value[activeButton.value];
  for (let i = 0; i < codeblock.length; i++) {
    if (codeblock[i].includes(changedProperty)) {
      codeblock[
        i
      ] = `${changedProperty}=${workingGroup.value[changedProperty]}`;
    }
  }
  codeblocks.value[activeButton.value] = codeblock;
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
        <form
          v-on:submit.prevent="
            {
              setMode();
            }
          "
          class="form-control flex flex-row flex-wrap my-2 gap-5"
        >
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
              />
            </label>
          </div>
          <button
            type="submit"
            :disabled="nextMode == modes.save ? true : false"
            class="btn btn-primary"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
