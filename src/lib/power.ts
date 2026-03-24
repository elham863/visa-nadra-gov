import { prisma } from "@/src/lib/prisma";

const APP_CONTROL_ID = "global";

export async function getPowerState(): Promise<boolean> {
  const control = await prisma.appControl.findUnique({
    where: { id: APP_CONTROL_ID }
  });
  if (!control) {
    await prisma.appControl.create({
      data: { id: APP_CONTROL_ID, powerOn: true }
    });
    return true;
  }
  return control.powerOn;
}

export async function setPowerState(powerOn: boolean): Promise<boolean> {
  const control = await prisma.appControl.upsert({
    where: { id: APP_CONTROL_ID },
    update: { powerOn },
    create: { id: APP_CONTROL_ID, powerOn }
  });
  return control.powerOn;
}
