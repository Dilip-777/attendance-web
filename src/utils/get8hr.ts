import { Designations, TimeKeeper } from "@prisma/client";
import _ from "lodash";


const getTotalAmountAndRows = (timekeeper: TimeKeeper[], month: number, year: number, designations?: Designations[], department?: string) => {
console.log(timekeeper, "timekeeper", month, year, designations, department);

    const rate: Record<string, string | number>  = {
    date: "Rate",
}

const  totalovertime1: Record<string, string | number>  = {
    date: "Total Overtime",
    total: 0
}
const attendancecount: Record<string, string | number> = {
  date: "Attendance Count",
}
const totalamount1: Record<string, string | number> = {
  date: "Total Amount",
  total: 0
}

const otamount: Record<string, string | number> = {
  date: "OT Amount",
  total: 0
}

const totalnetamount : Record<string, string | number> = {
  date: "Total Net Amount",
}

const cprate: Record<string, string | number> = {
  date: "CP",
}

const cpamount: Record<string, string | number> = {
  date: "CP Amount",
  total: 0
}

const total : Record<string, string | number> = {
  date: "Total"
}

const gst1 : Record<string, string | number> = {
  date: "GST"
}

const billAmount1 : Record<string, string | number> = {
  date: "Bill Amount"
}

const tds1 : Record<string, string | number> = {
  date: "TDS"
}

const netPayable1 : Record<string, string | number> = {
  date: "Net Payable"
}

  

  const getData = (date: string) => {
    const filtered = timekeeper.filter((item) => item.attendancedate === date && item.attendance === "1");
    const halfpresent = timekeeper.filter((item) => item.attendancedate === date && item.attendance === "0.5");

    const obj: Record <string, string | number > = {
         date: date,
          total: 0
    }
    designations?.forEach((designation) => {
      const id = designation.designationid
      const count = filtered.filter((item) => item.designation.toLowerCase() === designation.designation.toLowerCase() && item.gender && (designation.gender === "Both" || designation.gender[0] === item.gender[0])).length + halfpresent.filter((item) => item.designation.toLowerCase() === designation.designation.toLowerCase() && item.gender && (designation.gender === "Both" || designation.gender[0] === item.gender[0])).length / 2
      obj[id] = count
      obj["total"] = obj.total as number + count
    })
    return obj
  };



const rows2: any[] = []

    const rows = [];

        const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);


    

    for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
      const date = `${i.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}/${year}`;
      rows.push(getData(date));
    }


if(designations) {
  designations.forEach((designation) => {
    const filtered = timekeeper.filter((item) => {
      if(item.attendance === "0.5") return false
      if(designation.gender === "Male" || designation.gender === "M") {
            return item.designation.toLowerCase() === designation.designation.toLowerCase() && item.gender && item.gender[0] === designation.gender[0]
        }
        else if(designation.gender === "Female" || designation.gender === "F") {
          return item.designation.toLowerCase() === designation.designation.toLowerCase() && item.gender && item.gender[0] === designation.gender[0]
        }
        else {
          return item.designation.toLowerCase() === designation.designation.toLowerCase()
        }
      })

    const filtered1 = timekeeper.filter((item) => {
      if(item.attendance === "1") return false
      if(designation.gender === "Male" || designation.gender === "M") {
            return item.designation.toLowerCase() === designation.designation.toLowerCase() && item.gender && item.gender[0] === designation.gender[0]
        }
        else if(designation.gender === "Female" || designation.gender === "F") {
          return item.designation.toLowerCase() === designation.designation.toLowerCase() && item.gender && item.gender[0] === designation.gender[0]
        }
        else {
          return item.designation.toLowerCase() === designation.designation.toLowerCase()
        }
      })
      
    const id = designation.designationid
    attendancecount[id] = filtered.length + filtered1.length / 2
    
    rate[id] = designation.basicsalary
    if(designation.basicsalary_in_duration === "Monthly") {
      totalamount1[id] = Math.floor(_.get(attendancecount, id, 0) as number * Number(_.get(rate, id, 0)) / 30)
    }
    else totalamount1[id] = _.get(attendancecount, id, 0) as number * Number(_.get(rate, id, 0))

    totalamount1["total"] = totalamount1.total as number + Number(_.get(totalamount1, id, 0))
    totalovertime1[id] = filtered.reduce((acc, curr) => acc + parseInt(curr.manualovertime || curr.overtime), 0);
    totalovertime1["total"] = totalovertime1.total as number + Number(_.get(totalovertime1, id, 0))
    let otRate = 0
    if(designation.basicsalary_in_duration === "Monthly") {
       otRate = Math.floor( designation.basicsalary / designation.allowed_wrking_hr_per_day / 30)
    }
    else {
      otRate = Math.floor(designation.basicsalary / designation.allowed_wrking_hr_per_day)
    }
    otamount[id] = Number(_.get(totalovertime1, id, 0)) * otRate
    otamount["total"] = otamount.total as number + Number(_.get(otamount, id, 0))
    totalnetamount[id] = Number(_.get(totalamount1, id, 0)) + Number(_.get(otamount, id, 0))   
    cprate[id] = designation.servicecharge as number
    cpamount[id] = Number(_.get(attendancecount, id, 0)) * Number(_.get(cprate, id, 0))
    cpamount["total"] = cpamount.total as number + Number(_.get(cpamount, id, 0))
    total[id] = Number(_.get(totalnetamount, id, 0)) + Number(_.get(cpamount, id, 0))
    gst1[id] = Math.floor(_.get(total, id, 0) as number * 0.18)
    billAmount1[id] = Number(_.get(total, id, 0)) + Number(_.get(gst1, id, 0))
    tds1[id] = Math.floor(_.get(total, id, 0) as number * 0.01)
    netPayable1[id] = Number(_.get(billAmount1, id, 0)) + Number(_.get(tds1, id, 0))
 })
}

attendancecount["total"] = timekeeper.length
rate["total"] = 0
totalnetamount["total"] = parseInt(totalamount1.total as string) + parseInt(otamount.total as string)
total["total"] = totalnetamount.total + parseInt(cpamount.total as string)
gst1["total"] = Math.floor(total.total * 0.18)
billAmount1["total"] = total.total + gst1.total
tds1["total"] = Math.floor(total.total * 0.01)
netPayable1["total"] = billAmount1.total + tds1.total
rows2.push(attendancecount)
rows.push(attendancecount)

rows2.push(rate)
rows.push(rate)

rows2.push(totalamount1)
rows.push(totalamount1)
rows2.push(totalovertime1)
rows.push(totalovertime1)
rows2.push(otamount)
rows.push(otamount)
rows2.push(totalnetamount)
rows.push(totalnetamount)
if(department === "8HR" || department === "12HR" || department?.toLowerCase() === "colony") {
  rows2.push(cprate)
  rows.push(cprate)
  rows2.push(cpamount)
  rows.push(cpamount)
  rows2.push(total)
  rows.push(total)
} 
rows2.push(gst1)

rows2.push(billAmount1)
rows2.push(tds1)
rows2.push(netPayable1) 


    return { rows,  total1: total.total, rows1: rows2, totalnetPayable: netPayable1.total};
  }

  export default getTotalAmountAndRows