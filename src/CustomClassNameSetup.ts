import { unstable_ClassNameGenerator as ClassNameGenerator } from "@mui/material/className";

ClassNameGenerator.configure((componentName) => {
  let newComponentName = componentName;
  newComponentName = newComponentName.replace("Mui", "Netflix");
  newComponentName = newComponentName.replace("Button", "Btn");

  return newComponentName;
});
