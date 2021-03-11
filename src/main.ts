require('dotenv').config();

async function main(): Promise<void> {
  console.log('ENV:');
  console.log(process.env);
}

main();
