const VERCEL_API = "https://api.vercel.com";

function withTeamQuery(path: string): string {
  const teamId = process.env.VERCEL_TEAM_ID;
  if (!teamId) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}teamId=${teamId}`;
}

async function vercelFetch(path: string, init: RequestInit = {}) {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error("VERCEL_TOKEN is required");
  }

  const response = await fetch(`${VERCEL_API}${withTeamQuery(path)}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Vercel API ${path} failed (${response.status}): ${body}`);
  }

  return body ? JSON.parse(body) : null;
}

async function injectEnvVars(projectName: string) {
  const railwayBackendUrl = `https://${projectName}-backend-production.up.railway.app/api`;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || railwayBackendUrl;

  // Mevcut değişkeni kontrol etmeden önce varsa çakışmayı önlemek için ekliyoruz
  try {
    await vercelFetch(`/v10/projects/${projectName}/env`, {
      method: "POST",
      body: JSON.stringify({
        key: "NEXT_PUBLIC_API_URL",
        value: backendUrl,
        type: "plain",
        target: ["production", "preview", "development"],
      }),
    });
    console.log(`✅ Injected NEXT_PUBLIC_API_URL=${backendUrl} into Vercel settings.`);
  } catch (err) {
    console.log("ℹ️ Environment variable might already exist or project is nesting keys.");
  }
}

async function triggerDeployment(projectName: string, fallbackRepoId?: string) {
  const project = await vercelFetch(`/v9/projects/${projectName}`);
  // Farklı Vercel API versiyonlarında repoId lokasyonu değişebileceği için güvenli okuma yapıyoruz
  const repoId = project?.link?.repoId ?? project?.gitRepository?.repoId ?? fallbackRepoId;

  if (!repoId) {
    console.log("⚠️ No GitHub repo linked yet — Vercel integration processing, skipping deployment trigger");
    return;
  }

  const deployment = await vercelFetch("/v13/deployments", {
    method: "POST",
    body: JSON.stringify({
      name: projectName,
      target: "production",
      gitSource: {
        type: "github",
        repoId: String(repoId),
        ref: "main",
      },
    }),
  });

  console.log(`✅ Vercel production deployment triggered successfully: ${deployment?.id ?? deployment?.url ?? "ok"}`);
}

export async function provisionVercel() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.log("⚠️ VERCEL_TOKEN not set — skipping Vercel provisioning");
    return;
  }

  const projectName = process.env.PROJECT_NAME ?? "project";
  const repo = process.env.GITHUB_REPOSITORY ?? `gorkemkyolai0666/${projectName}`;

  let projectExists = false;
  let createdProjectData: any = null;

  try {
    await vercelFetch(`/v9/projects/${projectName}`);
    projectExists = true;
    console.log(`ℹ️ Vercel project already exists: ${projectName}`);
  } catch {
    console.log(`🚀 Creating Vercel project: ${projectName}`);
  }

  if (!projectExists) {
    createdProjectData = await vercelFetch("/v11/projects", {
      method: "POST",
      body: JSON.stringify({
        name: projectName,
        framework: "nextjs",
        rootDirectory: "frontend",
        gitRepository: {
          type: "github",
          repo: repo,
        },
      }),
    });
    console.log(`✅ Vercel project successfully created: ${createdProjectData.name}`);
  }

  try {
    await injectEnvVars(projectName);
  } catch (envError) {
    console.error("⚠️ Failed to inject env vars to Vercel:", envError);
  }

  try {
    const fallbackId = createdProjectData?.link?.repoId ?? createdProjectData?.gitRepository?.repoId;
    await triggerDeployment(projectName, fallbackId);
  } catch (deployError) {
    console.error("⚠️ Failed to trigger Vercel deployment:", deployError);
  }
}