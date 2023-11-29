import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function importdata(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    res.status(200).json(process.env.DATABASE_URL);
  }
  const data = req.body;
  const { type } = req.query;
  if (type === "employee") {
    try {
      const ids = data.map((employee: any) => employee.employeeId);
      await prisma.employee.deleteMany({
        where: {
          employeeId: {
            in: ids,
          },
        },
      });
      await prisma.employee.createMany({
        data: data,
        // skipDuplicates: true,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  } else if (type === "contractor") {
    const ids = data.map((contractor: any) => contractor.contractorId);
    await prisma.contractor.deleteMany({
      where: {
        contractorId: {
          in: ids,
        },
      },
    });
    await prisma.contractor.createMany({
      data: data,
      skipDuplicates: true,
    });
    res.status(200).json({ success: true });
  } else if (type === "department") {
    await prisma.department.createMany({
      data: data,
      skipDuplicates: true,
    });
    res.status(200).json({ success: true });
  } else if (type === "designation") {
    const names = data.map((designation: any) => ({
      name: designation.departmentname,
      id: designation.departmentId,
    }));
    // let d: string[] = []
    // names.forEach(async ({id, name}: {id: string, name: string}) => {
    //     const department = await prisma.department.findUnique({
    //         where: {
    //             id: id
    //         }
    //     })
    //     const d2 = await prisma.department.findUnique({
    //         where: {
    //             department: name
    //         }
    //     })
    //     if(!(department && d2)) {
    //         if(!d.includes(name)) {
    //             d.push(name)
    //         }
    //     }

    // })
    // if(d.length > 0) {
    //     res.status(400).json({success: false, message: `Department ${d.join(",")} does not exist`})
    //     return
    // }

    await prisma.designations.createMany({
      data: data,
      skipDuplicates: true,
    });
    res.status(200).json({ success: true });
  } else {
    // await prisma.timeKeeper.deleteMany({
    //     where: {
    //         contractorid: "8123"
    //     }
    // })

    console.log(data[0]);

    const timekeepers = await prisma.timeKeeper.createMany({
      data: data,
      skipDuplicates: true,
    });

    console.log(timekeepers);

    const employees = await prisma.employee.findMany({
      where: {
        gender: "Female",
      },
      select: {
        employeeId: true,
      },
    });

    const updatedTimekeepers = await prisma.timeKeeper.updateMany({
      data: {
        gender: "Female",
      },
      where: {
        employeeid: {
          in: employees.map((employee) => employee.employeeId),
        },
      },
    });
    // const timeKeeper = await prisma.timeKeeper.create({
    //    data: data[0]
    // })

    res.status(200).json({ success: true });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};
