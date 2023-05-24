


export default function getAutomobile (automobile: any[], month: number , year: number ) { 
     
    const getData = (date: string) => {
        const data = automobile.find((item) => item.date === date);
        if(!data) return { date: date }
        return data
    }
        const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
const rows = [];
    for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
        if(i > new Date().getDate()) break
      const date = `${i.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}/${year}`;
        console.log(i, month, year);
        
      rows.push(getData(date));
    }

    return rows
}