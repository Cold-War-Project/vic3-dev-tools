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

const updateData = async (changedProperty: string) => {
  if (changedProperty == "" || changedProperty == null) {
    return;
  }
  // for the changedProperty, grab the old value from the previousWorkingGroup and the new value from the workingGroup object
  //hack this is to avoid infinite percent change if 0 was in the denominator (see percentChange below)
  const oldValMain =
    previousWorkingGroup[changedProperty] === 0
      ? 1
      : previousWorkingGroup[changedProperty];
  const newValMain = workingGroup.value[changedProperty];

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

  //get the percentChange from the old to new value
  const percentChange = (newValMain - oldValMain) / oldValMain;

  //divide the percentChange by the number of non-zero properties
  //const percentChangePerProperty = percentChange / nonZeroProperties.length;

  //for each non-zero property, multiply the percentChangePerProperty by the old value and add that to the old value to get the new value
  for (let i = 0; i < nonZeroProperties.length; i++) {
    let prop = nonZeroProperties[i];
    let oldVal = previousWorkingGroup[prop];
    let newVal = Math.floor(oldVal + oldVal * percentChange);
    if (newVal <= 0) {
      // valueIsInvalid(prop);
      console.error(
        `new value is ${newVal}, which is less than 0 for ${prop} property`
      );
      return;
    }
    if (prop === "total") continue;
    if (prop === changedProperty) continue;
    workingGroup.value[prop] = newVal;
  }

  //Double check that the total is still equal workingGroup.total, if it isn't throw an error
  let total = 0;
  for (let i = 0; i < popTypes.value.length; i++) {
    if (popTypes.value[i] === "total") continue;
    total += workingGroup.value[popTypes.value[i]];
  }
  if (total !== workingGroup.value.total) {
    workingGroup.value[changedProperty] += workingGroup.value.total - total;
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
