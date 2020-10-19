import {
  assertEquals,
} from "../test_deps.ts";

import { filterHabitablePlanets } from "./planets.ts";

//checking witch planet that has all the criteria we need to pass (Earth)
const HABITABLE_PLANET = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1",
  koi_smass: "1",
};

//creating an plannet that is not confirmed (will give us a failure)
const NOT_CONFIRMED = {
  koi_disposition: "FALSE POSITIVE",
};

const TOO_LARGE_PLANETARY_RADIUS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1.5",
};

const TOO_LARGE_SOLAR_RADIUS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1.01",
};

const TOO_LARGE_SOLAR_MASS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1",
  koi_smass: "1.04",
};

Deno.test({
  name: "filter only habitable planets",
  fn() {
    const filtered = filterHabitablePlanets([
      HABITABLE_PLANET,
      NOT_CONFIRMED,
      TOO_LARGE_PLANETARY_RADIUS,
      TOO_LARGE_SOLAR_RADIUS,
      TOO_LARGE_SOLAR_MASS,
    ]);
    assertEquals(filtered, [HABITABLE_PLANET]);
  },
});
