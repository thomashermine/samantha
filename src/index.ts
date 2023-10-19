import 'dotenv/config';

async function main() {
  console.log("Hello, world!");
  console.log('Here are your environnment variables:');
  console.log(process.env);
}

main();