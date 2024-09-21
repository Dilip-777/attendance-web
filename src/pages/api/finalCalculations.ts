import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {
      contractorId,
      month,
      hiringCharged,
      hsdCost,
      hsdConsumed,
      hsdRateCharged,
      totalCost,
    } = req.body;
    const finalCalculation = await prisma.finalCalculations.findUnique({
      where: {
        month_contractorId: {
          month,
          contractorId,
        },
      },
    });
    if (finalCalculation) {
      await prisma.finalCalculations.update({
        where: {
          month_contractorId: {
            month,
            contractorId,
          },
        },
        data: {
          hiringCharged,
          hsdCost,
          hsdConsumed,
          hsdRateCharged,
          totalCost,
        },
      });
    } else {
      await prisma.finalCalculations.create({
        data: {
          contractorId,
          month,
          hiringCharged,
          hsdCost,
          hsdConsumed,
          hsdRateCharged,
          totalCost,
        },
      });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        contractorId: contractorId as string,
      },
    });

    if (contractorId && month) {
      await prisma.fixedVehicle.deleteMany({
        where: {
          contractorId: contractorId as string,
          month,
        },
      });
    }

    await prisma.fixedVehicle.createMany({
      data: vehicles.map((vehicle) => ({
        contractorId: contractorId as string,
        month,
        vehicleId: vehicle.id,
        vehicleNo: vehicle.vehicleNo,
        vehicleType: vehicle.vehicleType,

        mileage: vehicle.mileage,
        charges: vehicle.charges,
        paymentMode: vehicle.paymentMode,
        paymentStructure: vehicle.paymentStructure,
        rate: vehicle.rate,
        shiftduraion: vehicle.shiftduraion,
        mainenanceTime: vehicle.mainenanceTime,
        maintenanceDaysAllowed: vehicle.maintenanceDaysAllowed,
        deployment: vehicle.deployment,
        eligibleForOvertime: vehicle.eligibleForOvertime,
        hsdProvidedBy: vehicle.hsdProvidedBy,
        hsdDeduction: vehicle.hsdDeduction,
        gst: vehicle.gst,
      })),
    });

    await prisma.automobile.updateMany({
      where: {
        contractorId: contractorId as string,
        date: {
          endsWith: month,
        },
      },
      data: {
        freeze: true,
      },
    });

    await prisma.hsd.updateMany({
      where: {
        contractorId: contractorId as string,
        month: month,
      },
      data: {
        freeze: true,
      },
    });

    res.status(200).json({ message: 'Success' });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const f = await prisma.finalCalculations.delete({
      where: {
        id: id as string,
      },
    });
    if (!f) {
      return res.status(404).json({ message: 'Not found' });
    }
    const { contractorId, month } = f;
    await prisma.fixedVehicle.deleteMany({
      where: {
        contractorId: contractorId as string,
        month,
      },
    });
    await prisma.automobile.updateMany({
      where: {
        contractorId: contractorId as string,
        date: {
          endsWith: month,
        },
      },
      data: {
        freeze: false,
      },
    });
    await prisma.hsd.updateMany({
      where: {
        contractorId: contractorId as string,
        month: month,
      },
      data: {
        freeze: false,
      },
    });
    res.status(200).json({ message: 'Success' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
