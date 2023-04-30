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
const currentMode = mode.currentMode;

const changedProperty = ref("");

const isSaving = ref(false);

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

const previousWorkingGroup = ref<WorkingGroup>({
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
};

const updateData = (changedProperty: string) => {
  if (changedProperty == "") {
    return;
  }
  previousWorkingGroup.value = workingGroup.value;
  // setting `isSaving` to true will sync the workingGroup data with the data currently displayed on screen by updating the v-model property below.
  isSaving.value = true;
  //Debug
  console.log(`updating original data array`);

  // for the changedProperty, grab the old value from the previousWorkingGroup and the new value from the workingGroup object
  const oldValue = previousWorkingGroup.value[changedProperty];
  const newValue = workingGroup.value[changedProperty];

  //get the property names of all the non-zero properties in the workingGroup object
  const nonZeroProperties = Object.keys(workingGroup.value).filter(
    (prop) => workingGroup.value[prop] !== 0
  );

  //divide the difference of the new and old values by the number of non-zero properties
  const difference = (newValue - oldValue) / nonZeroProperties.length;

  //disperse that difference across all the non-zero properties
  nonZeroProperties.forEach((prop) => {
    workingGroup.value[prop] += difference;
  });

  //debug double check that the total value still equals the sum of all other properties in the workingGroup object
  let total = 0;
  for (let i = 0; i < popTypes.value.length; i++) {
    total += workingGroup.value[popTypes.value[i]];
  }
  if (total !== workingGroup.value.total) {
    console.error(`total is not equal to sum of all other properties`);
    console.log(`total: ${total}`);
    console.log(`sum of all other properties: ${workingGroup.value.total}`);
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
  //debug
  console.log(`codeblocks:`);
  console.log(codeblocks.value);
  //debug
  console.log(`workingGroup:`);
  console.log(workingGroup.value);
  //debug
  console.log(`previousWorkingGroup:`);
  console.log(previousWorkingGroup.value);
  //debug
  console.log(`isSaving: ${isSaving.value}`);
  //debug
  console.log(`activeButton: ${activeButton.value}`);
  //debug
  console.log(`changedProperty: ${changedProperty}`);
  //debug
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
              updateData(changedProperty);
              setMode();
            }
          "
          class="form-control flex flex-row flex-wrap my-2 gap-5"
        >
          <label class="input-group input-group-horizontal input-group-xs">
            <span>Total workers for {{ activeButton }}</span>
            <input
              type="text"
              :disabled="currentMode == modes.save ? true : false"
              :placeholder="workingGroup.total"
              v-model="workingGroup.total"
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
                @change="updateData(popType)"
                type="text"
                :disabled="currentMode == modes.save ? true : false"
                class="input input-bordered w-20"
                :placeholder="workingGroup[popType]"
                :v-model="isSaving ? workingGroup[popType] : false"
              />
            </label>
          </div>
          <button
            type="submit"
            :disabled="currentMode == modes.save ? true : false"
            class="btn btn-primary"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
