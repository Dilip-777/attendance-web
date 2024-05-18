import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function measurement(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { contractorid: id } = req.query;
    if (id) {
      const measurement = await prisma.measurement.findMany({
        where: {
          contractorid: id as string,
        },
        include: {
          contractor: true,
          measurementItems: true,
        },
      });
      res.status(200).json(measurement);
      return;
    }
    const measurement = await prisma.measurement.findMany({
      include: {
        contractor: true,
        measurementItems: true,
      },
    });
    res.status(200).json(measurement);
  }

  if (req.method === "POST") {
    const { measurementItems, ...rest } = req.body;

    let measurementitems: any[] = [];

    const workids = measurementItems.map(
      (item: any) => item.referenceWorkId || "jhj"
    );

    const measurement = await prisma.measurement.findMany({
      where: {
        id: {
          in: workids,
        },
      },
    });

    measurementItems.forEach(async (measurementItem: any) => {
      if (measurementItem.referenceWorkId) {
        const work = measurement.find(
          (item) => item.id === measurementItem.referenceWorkId
        );
        if (work) {
          const quantity = parseFloat(work.totalQuantity.toFixed(3));
          const valueofcurrentBill = parseFloat(
            (quantity * measurementItem.unitrate).toFixed(3)
          );
          // return {
          //     ...barBendingItem,
          //     quantity,
          //     valueofcurrentBill,
          //     totalQuantity: quantity,
          //     valueofTotalBill: valueofcurrentBill
          // }
          measurementitems.push({
            ...measurementItem,
            quantity,
            valueofcurrentBill,
            totalQuantity: quantity,
            valueofTotalBill: valueofcurrentBill,
          });
        } else {
          console.log("work not found");
        }
      } else {
        measurementitems.push(measurementItem);
      }
    });

    const totalAmount = measurementitems.reduce((acc, item) => {
      return acc + item.valueofcurrentBill;
    }, 0);

    const totalQuantity = measurementitems.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);

    const work = await prisma.measurement.create({
      data: {
        ...rest,
        totalAmount,
        totalQuantity,
        measurementItems: {
          createMany: {
            data: measurementitems,
          },
        },
      },
    });

    res.status(200).json(work);
  }

  if (req.method === "PUT") {
    const { measurementItems, ...rest } = req.body;

    await prisma.measurementItem.deleteMany({
      where: {
        measurementId: rest.id,
      },
    });

    const workids = measurementItems.map(
      (item: any) => item.referenceWorkId || "slfj"
    );

    const works = await prisma.measurement.findMany({
      where: {
        id: {
          in: workids,
        },
      },
    });

    let measurementitems: any[] = [];

    measurementItems.forEach((workItem: any) => {
      if (workItem.referenceWorkId) {
        const work = works.find((item) => item.id === workItem.referenceWorkId);
        if (work) {
          console.log(work);

          const quantity = work.totalQuantity;
          const valueofcurrentBill = parseFloat(
            (quantity * workItem.unitrate).toFixed(3)
          );
          // return {
          //     ...barBendingItem,
          //     quantity,
          //     valueofcurrentBill,
          //     totalQuantity: quantity,
          //     valueofTotalBill: valueofcurrentBill
          // }

          measurementitems.push({
            ...workItem,
            quantity,
            valueofcurrentBill,
            totalQuantity: quantity,
            valueofTotalBill: valueofcurrentBill,
          });
          console.log({
            ...workItem,
            quantity,
            valueofcurrentBill,
            totalQuantity: quantity,
            valueofTotalBill: valueofcurrentBill,
          });
        } else {
          console.log("work not found");
        }
      } else {
        measurementitems.push(workItem);
      }
    });

    const totalAmount = measurementitems.reduce((acc, item) => {
      return acc + item.valueofcurrentBill;
    }, 0);

    const totalQuantity = measurementitems.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);

    const work = await prisma.measurement.update({
      where: {
        id: rest.id,
      },
      data: {
        ...rest,
        totalAmount: parseFloat(totalAmount.toFixed(3)),
        totalQuantity: parseFloat(totalQuantity.toFixed(3)),
        measurementItems: {
          createMany: {
            data: measurementitems,
          },
        },
      },
    });

    console.log(totalAmount, measurementitems);

    console.log("lsjdflskjfkl");

    res.status(200).json({ success: true });

    // measurementItems.forEach(async (workItem) => {
    //     if(workItem.id) {

    // const { workItem, description, contractorid, id } = req.body
    // if(description && contractorid) {

    //     await prisma.works.update({
    //         where: {
    //             id: id
    //         },
    //         data: {
    //             description,
    //             contractorid,
    //         }
    //     })
    // }

    // if(workItem) {

    //     await prisma.workItem.update({
    //         where: {
    //             id: workItem.id
    //         },
    //         data: workItem,
    //     })
    // }

    //  await prisma.workItem.createMany({
    //     data: measurementItems,
    //     skipDuplicates: true
    // })

    // res.status(200).json({ success: true })
  }
}
