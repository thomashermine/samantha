/**
 * Sleep for a given number of milliseconds.
 * @param ms - The number of milliseconds to sleep for.
 */
export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
