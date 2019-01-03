// public calculateContactTriggerRate(airControloState: AirControlState) {
//   const { planes } = this.fleet
//   const totalTriggerFactor = planes
//     .filter(plane => plane.canContact)
//     .reduce((value, plane) => value + plane.contactTriggerFactor, 0)

//   return (Math.floor(totalTriggerFactor) + 1) / (70 - 15 * airControloState.contactMultiplier)
// }
