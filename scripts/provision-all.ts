import { provisionRailway } from "./provision-railway";
import { provisionVercel } from "./provision-vercel";

async function main() {
  console.log("🚀 Starting infrastructure provisioning...");

  try {
    await provisionRailway();
    console.log("✅ Railway provisioning completed");
  } catch (error) {
    console.error("❌ Railway provisioning failed");
    console.error(error);
  }

  try {
    await provisionVercel();
    console.log("✅ Vercel provisioning completed");
  } catch (error) {
    console.error("❌ Vercel provisioning failed");
    console.error(error);
  }

  console.log("🏁 Provisioning finished");
}

main().catch((error) => {
  console.error("💥 Fatal provisioning error");
  console.error(error);
  process.exit(1);
});