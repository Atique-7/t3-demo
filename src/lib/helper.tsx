import Decimal from "decimal.js";
import {
  CurrentLabour,
  CurrentPart,
  DateExpandedObj,
  Invoice,
  JobCard,
  Labour,
  Part,
  TaxObj,
  UserType,
} from "./definitions";

export const jobCardStatusKey = [
  { code: 999, description: "All" },
  { code: 0, description: "Job Card Created" },
  { code: 1, description: "Parts Added" },
  { code: 2, description: "Labour Added" },
  { code: 3, description: "Quote Generated" },
  { code: 4, description: "Pro-Forma Invoice Generated" },
  { code: 5, description: "Tax Invoice Generated" },
  { code: 6, description: "Gate Pass Generated" },
  { code: 7, description: "Car Exited" },
];

export const carMakes = [
  { code: 0, description: "Hyundai" },
  { code: 1, description: "Tata" },
  { code: 2, description: "Volkswagon" },
  { code: 3, description: "BMW" },
  { code: 4, description: "Mercedes" },
];

export const adminReportTimelineDrop = [
  { key: "thisMonth", value: "This Month" },
  { key: "lastMonth", value: "Last Month" },
  { key: "lastSixMonths", value: "Last 6 Months" },
  { key: "lastYear", value: "Last Year" },
  { key: "custom", value: "Custom" },
];

export const purposeOfVisits = [
  { code: 1, description: "Bodyshop" },
  { code: 0, description: "General visit" },
  { code: 2, description: "Paid service" },
  { code: 3, description: "Running Repair" },
];

export const serviceAdvisors = [
  {
    purposeOfVisitCode: 0,
    description: "General Visit",
    advisors: [
      { name: "atique", email: "atique+serviceadvisor@mindise.co.in" },
      { name: "atique1", email: "atique1+serviceadvisor@mindise.co.in" },
    ],
  },
  {
    purposeOfVisitCode: 1,
    description: "Bodyshop",
    advisors: [
      { name: "omkar", email: "atqiude+serviceAdvisor@mindise.co.in" },
      { name: "atique2", email: "atqifue+serviceAdvisor@mindise.co.in" },
    ],
  },
  {
    purposeOfVisitCode: 2,
    description: "Paid service",
    advisors: [
      { name: "omkar1", email: "omkar+serviceadvisor@mindise.co.in" },
      { name: "aatiqu3", email: "atqiue+serviceAdvisor@mindise.co.in" },
    ],
  },
  {
    purposeOfVisitCode: 3,
    description: "Running repair",
    advisors: [
      { name: "omkar", email: "omkar+servicerunning@mindise.co.in" },
      { name: "atique4", email: "atqiu86e+serviceAdvisor@mindise.co.in" },
    ],
  },
];

export const carMakeModels = [
  {
    company: "Maruti Suzuki",
    models: [
      "ALTO",
      "ALTO 800",
      "BALENO",
      "CELERIO",
      "CELERIO X",
      "CIAZ",
      "DZIRE",
      "EECO",
      "ERTIGA",
      "ERTIGA (NEW)",
      "ESTEEM",
      "A-STAR",
      "GYPSY",
      "IGNIS",
      "M 800",
      "OMNI",
      "RITZ",
      "S-CROSS",
      "S-PRESSO",
      "SWIFT",
      "SWIFT (NEW)",
      "SWIFT DZIRE",
      "SWIFT DZIRE (NEW)",
      "SX4",
      "VITARA BREZZA",
      "Grand Vitara",
      "WAGON R",
      "WAGON-R (NEW)",
      "XL6",
      "ZEN",
      "ZEN ESTILO",
    ],
  },
  {
    company: "Audi",
    models: [
      "A6",
      "A8L",
      "Q2",
      "Q8",
      "Q8 Celebration",
      "RS 7 Sportback",
      "RS Q8",
    ],
  },
  {
    company: "Mercedes",
    models: ["GLE", "S- Class", "E - Class", "B - Class", "G - Wagon"],
  },
  {
    company: "BMW",
    models: [
      "2 Series Gran Coupe",
      "3 Series",
      "3 Series GT",
      "5 Series",
      "6 Series GT",
      "7 Series",
      "8 Series Gran Coupe",
      "M Plus",
      "X1",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4 Roadster",
    ],
  },
  {
    company: "Volvo",
    models: ["XC 40", "XC 60"],
  },
  {
    company: "Datsun",
    models: ["Go", "Go+", "Redi-Go"],
  },
  {
    company: "Fiat",
    models: ["Abarth Punto", "Avventura", "Linea", "Punto Evo", "Urban Cross"],
  },
  {
    company: "Ford",
    models: ["Aspire", "EcoSport", "Endeavour", "Figo", "Freestyle", "Mustang"],
  },
  {
    company: "Honda",
    models: [
      "Amaze",
      "City",
      "Civic",
      "CR-V",
      "Jazz",
      "WR-V",
      "Mobilio",
      "Brio",
    ],
  },
  {
    company: "Hyundai",
    models: [
      "Aura",
      "Alacazar",
      "Creta",
      "Elantra",
      "Eon",
      "i10",
      "Grand i10",
      "Grand i10 NIOS",
      "I20",
      "Kona Electric",
      "Santro",
      "Tucson",
      "Venue",
      "Verna",
      "Xcent Prime",
    ],
  },
  {
    company: "Jeep",
    models: ["Compass", "Wrangler"],
  },
  {
    company: "Land Rover",
    models: ["Range Rover Evoque", "Range Rover Sport"],
  },
  {
    company: "Kia",
    models: ["Carnival", "Seltos", "Sonet"],
  },
  {
    company: "Mahindra",
    models: [
      "Alturas G4",
      "Bolero",
      "KUV100",
      "Marazzo",
      "Nuvo Sport",
      "Scorpio",
      "Thar",
      "TUV300",
      "Verito",
      "XUV300",
      "XUV500",
      "XUV700",
    ],
  },
  {
    company: "MG",
    models: ["Gloster", "Hector", "Hector Plus", "ZS", "ZSN"],
  },
  {
    company: "Mini Cooper",
    models: ["D - Diesel", "G - Gasoline"],
  },
  {
    company: "Nissan",
    models: ["GT-R", "Kicks", "Micra", "Sunny"],
  },
  {
    company: "Renault",
    models: ["Duster", "Kiger", "Kwid", "Triber"],
  },
  {
    company: "Skoda",
    models: ["Karoq", "Kodiaq", "Octavia", "Rapid", "Superb"],
  },
  {
    company: "Mitsubishi",
    models: ["Lancer", "Pajero"],
  },
  {
    company: "Bentley",
    models: ["S Class", "G Class"],
  },
  {
    company: "Tata",
    models: [
      "Altroz",
      "Harrier",
      "Nexon",
      "Nexon EV",
      "Tiago",
      "Tigor",
      "Punch",
      "Safari",
      "Bolt",
    ],
  },
  {
    company: "Toyota",
    models: [
      "Camry Hybrid",
      "Fortuner",
      "Fortuner TRD",
      "Glanza",
      "Innova Old",
      "Innova Crysta",
      "Innova Crysta Leadership Edition",
      "Urban Cruiser",
      "Vellfire",
      "Yaris",
      "Corolla Altis",
    ],
  },
  {
    company: "Volkswagen",
    models: [
      "Ameo",
      "Jetta",
      "Passat",
      "Polo",
      "Polo GT",
      "Tiguan",
      "T-Roc",
      "Vento",
    ],
  },
  {
    company: "Chevrolet",
    models: [
      "Beat",
      "Tavera",
      "Cruze",
      "Sail",
      "Spark",
      "Camaro",
      "Enjoy",
      "Trailblazer",
      "Aveo",
      "Aveo U-VA",
      "Captiva",
      "Optra",
      "Optra SRV",
      "Corvette",
      "Sail U-Va",
    ],
  },
];

export const policyProvidersDict = [
  {
    insurer: "Acko General Insurance Co. Ltd.",
    address:
      "5th floor,B wing, B-501,Lotus Corporate Park,, off western express highway",
    GST: "27AAOCA9055C1ZJ",
  },
  {
    insurer: "Bajaj Allianz General Insurance",
    address: "952/954,Appasaheb Marathe Marg,, Nr. Chaitnya Tower",
    GST: "27AABCB5730G1ZX",
  },
  {
    insurer: "Bharti AXA General Insurance Company Ltd.",
    address:
      "Bharti AXA General Insurance Company Ltd 7&8 Floor Times Square 349 and 349/1 of Revenue Village Gundvali Taluka",
    GST: "27AADCB2008D1ZC",
  },
  {
    insurer: "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LTD",
    address: "No.102 A,Gr. Floor,Leena Bussiness Park,, village Marol",
    GST: "27AABCC6633K1ZJ",
  },
  {
    insurer: "Go Digit General Insurance Ltd.",
    address:
      "Tower -1,Elphinstone(West),1201,12th Floor,, India Bull Finance Center, Senapati Bapat Road",
    GST: "27AACCO4128Q1Z0",
  },
  {
    insurer: "Edelweiss General Insurance Co. Ltd.",
    address: "5th Floor, Tower 3, Kohinoor City Mall,, Kirol Road, Kurla West",
    GST: "27AAECE2328J1ZO",
  },
  {
    insurer: "Future Generali General Insurance",
    address: "Unit  No .801 802,Tower C 247 Embassy Park,LBS Marg",
    GST: "27AABCF0191R2Z8",
  },
  {
    insurer: "Iffco Tokio General Insurance Co. Ltd.",
    address: "2ND FLOOR AFL HOUSE,LOK BHARTI COMPLEX",
    GST: "27AAACI7573H1ZC",
  },
  {
    insurer: "Kotak Mahindra General Insurance Co. Ltd.",
    address:
      "A.K. Vaidya Marg, 8th floor, Zone IV, Kotak Towers, Bldg No-21, Infiniti IT park, off W.E.Highway, Malad (E)",
    GST: "27AAFCK7016C1ZT",
  },
  {
    insurer: "LIBERTY GENERAL INSURANCE LIMITED",
    address:
      "10th Floor,Tower A,Peninsula Busieness Park, Ganpatrao Kadam Marg, Lower Parel",
    GST: "27AABCL9950A1ZL",
  },
  {
    insurer: "NATIONAL INSURANCE COMPANY LIMITED",
    address:
      "Mumbai Business office V First floor 14. Jamshedji tata road, churchgate, Mumbai 400020",
    GST: "27AAACN9967E1Z3",
  },
  {
    insurer: "THE NEW INDIA ASSURANCE CO LTD",
    address: "New India Centre,12 th floor,17/A, Cooperage Road,Churchgate",
    GST: "27AAACN4165C3ZP",
  },
  {
    insurer: "The Oriental Insurance Co. Ltd.",
    address: "",
    GST: "NaN",
  },
  {
    insurer: "Raheja QBE General Insurance Co. Ltd.",
    address:
      "501-502, 5TH FLOOR,FULCRUM WING A,, IA PROJECT ROAD, SAHAR ANDHERI EAST",
    GST: "27AADCR7145R1ZN",
  },
  {
    insurer: "Reliance General Insurance Co Ltd",
    address: "Reliance Centre South Wing 4th Floor",
    GST: "27AABCR6747B1ZG",
  },
  {
    insurer: "SBI General Insurance Co. Ltd.",
    address:
      "101,1st Floor,Krishna Baug, A Wing New Maneklal Est, Above Bank Of Baroda S N Mehta Marg",
    GST: "27AAMCS8857L1ZC",
  },
  {
    insurer: "Shriram General Insurance Co. Ltd.",
    address:
      "10TH FLOOR, 1006 , PLOT NO. 19/20,SANTRA PLAZA COMMERCIAL COMPLEX,, PALM BEACH ROAD, SECTOR 19 D VASHI,NAVI MUMBAI, Thane, Maharashtra",
    GST: "27AAKCS2509K1Z3",
  },
  {
    insurer: "Tata AIG General Insurance Co. Ltd.",
    address: "15th Floor,Tower A, Peninsula Business Park GK Marg",
    GST: "27AABCT3518Q1ZW",
  },
  {
    insurer: "United India Insurance Co. Ltd.",
    address:
      "UNITED INDIA INSURANCE CO.LTD., MUMBAI RO-I 5TH FLOOR, UNION CO-OPERATIVE INSURANCE BLDG. ABOVE VODAFONE GALLERY, SIR P.M.ROAD, FORT,MUMBAI-400001",
    GST: "27AAACU5552C1ZJ",
  },
  {
    insurer: "Universal Sompo General Insurance Co. Ltd.",
    address: "114, First Floor, Ackruti Star, MIDC Center",
    GST: "27AAACU8917F1Z6",
  },
  {
    insurer: "HDFC ERGO GEN INS CO LTD",
    address: "6th  Floor,Leela Business Park, Andheri Kurla Road",
    GST: "27AABCL5045N1Z8",
  },
  {
    insurer: "ICICI LOMBARD GENERAL INS CO LTD",
    address: "ICICI Lombard House ,414,Veer Savarkar Marg",
    GST: "27AAACI7904G1ZN",
  },
  {
    insurer: "Royal Sundaram General Insurance Co. Ltd.",
    address: "Delphi C Wing, 2nd floor 201-204 ,Hiranandani Business Park",
    GST: "27AABCR7106G1ZJ",
  },
  {
    insurer: "OLA FLEET TECHNOLOGIES PVT LTD",
    address: "C.R.ARCADE Office, Andheri East",
    GST: "27AAKCA2311H1Z0",
  },
  {
    insurer: "Magma HDI General Insurance Co. Ltd.",
    address: "Khodal Chambers,2nd Floor Unit 203 & 204 R B Mehta Marg",
    GST: "27AAGCM1685C1ZJ",
  },
  {
    insurer: "Navi General Insurance Ltd.",
    address: "",
    GST: "NaN",
  },
  {
    insurer: "National Insurance Company Ltd",
    address: "Gurgaon DO-I, SCO No.- 41-42-43.Sector-31",
    GST: "06AAACN9967E2Z6",
  },
  {
    insurer: "ZUNO GENERAL INSURANCE LIMITED",
    address:
      "2 ND FLOOR, B WING, UNIT NO 32, KOHINOOR CITY MALL,, TOWER 3, KIROL ROAD, KURLA WEST",
    GST: "27AAECE2328J1ZO",
  },
  {
    insurer: "ZURICH KOTAK GENERAL INSURANCE COMPANY (INDIA) LIMITED",
    address:
      "4th Floor, Unit No. 401, Silver Metropolis,, Jai Coach Compound, Off Western Express Highway,Goregaon East",
    GST: "27AAFCK7016C1ZT",
  },
];

export const policyProviders = [
  "Acko General Insurance Co. Ltd.",
  "Bajaj Allianz General Insurance",
  "Bharti AXA General Insurance Company Ltd.",
  "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LTD",
  "Go Digit General Insurance Ltd.",
  "Edelweiss General Insurance Co. Ltd.",
  "Future Generali General Insurance",
  "Iffco Tokio General Insurance Co. Ltd.",
  "Kotak Mahindra General Insurance Co. Ltd.",
  "LIBERTY GENERAL INSURANCE LIMITED",
  "NATIONAL INSURANCE COMPANY LIMITED",
  "THE NEW INDIA ASSURANCE CO LTD",
  "The Oriental Insurance Co. Ltd.",
  "Raheja QBE General Insurance Co. Ltd.",
  "Reliance General Insurance Co Ltd",
  "SBI General Insurance Co. Ltd.",
  "Shriram General Insurance Co. Ltd.",
  "Tata AIG General Insurance Co. Ltd.",
  "United India Insurance Co. Ltd.",
  "Universal Sompo General Insurance Co. Ltd.",
  "HDFC ERGO GEN INS CO LTD",
  "ICICI LOMBARD GENERAL INS CO LTD",
  "Royal Sundaram General Insurance Co. Ltd.",
  "OLA FLEET TECHNOLOGIES PVT LTD",
  "Magma HDI General Insurance Co. Ltd.",
  "Navi General Insurance Ltd.",
  "National Insurance Company Ltd",
  "ZUNO GENERAL INSURANCE LIMITED",
  "ZURICH KOTAK GENERAL INSURANCE COMPANY (INDIA) LIMITED",
];

export const invoiceTypes = [
  { code: 3, description: "Quote" },
  { code: 4, description: "Pro-Forma Invoice" },
  { code: 5, description: "Tax Invoice" },
  { code: 6, description: "Gate Pass" },
];

export const InsuranceinvoiceTypes = [
  { code: 3, description: "Quote", name: "Quote" },
  {
    code: 4,
    description: "Customer Pro-Forma Invoice",
    type: "Customer",
    name: "Pro-Forma Invoice",
  },
  {
    code: 4,
    description: "Insurance Pro-Forma Invoice",
    type: "Insurance",
    name: "Pro-Forma Invoice",
  },
  {
    code: 5,
    description: "Customer Tax Invoice",
    type: "Customer",
    name: "Tax Invoice",
  },
  {
    code: 5,
    description: "Insurance Tax Invoice",
    type: "Insurance",
    name: "Tax Invoice",
  },
  { code: 6, description: "Gate Pass", name: "Gate Pass" },
];

export const getAllCarMakes = () => {
  let makes: string[] = [];

  carMakeModels.map((make) => makes.push(make.company));

  return makes;
};

export const taxAmtHelper = (
  price: number,
  quantity: number,
  gst: number,
  discount?: number,
  value?: string
) => {
  // console.log("QUANTITY", quantity);
  let amtPreGst = price * quantity;

  if (discount) {
    amtPreGst = amtPreGst * (1 - discount / 100);
  }

  let amtPostGst = amtPreGst * (1 + gst / 100);
  amtPostGst = roundToTwoDecimals(Number(amtPostGst));

  if (value) {
    return amtPostGst;
  } else {
    return <div>&#8377;{Number(amtPostGst)}</div>;
  }
};

export const amtHelperWithoutTax = (
  price: number,
  quantity: number,
  discount?: number
) => {
  let amtPreGst = price * quantity;
  if (discount) {
    amtPreGst = amtPreGst * (1 - discount / 100);
  }

  amtPreGst = roundToTwoDecimals(Number(amtPreGst));

  return amtPreGst;
};

export const objToStringArr = (obj: any[]) => {
  let newArr: string[] = [];
  obj.map((a) => newArr.push(JSON.stringify(a)));
  return newArr;
};

export const stringToObj = (strings: string[]) => {
  let newObjArr: any[] = [];
  strings.map((a) => newObjArr.push(JSON.parse(a)));
  return newObjArr;
};

export const getButtonText = (
  userAccess: string,
  isAdding: boolean,
  forPartsManager: boolean
) => {
  // if(userAccess == "parts"){
  switch (userAccess) {
    case "parts":
      if (isAdding && forPartsManager) {
        return <div>Add</div>;
      } else {
        return <div>Edit</div>;
      }

    case "biller":
      if (isAdding) {
        return <div>Add</div>;
      } else {
        return <div>Edit</div>;
      }

    default:
      return <></>;
  }
  // }else{}
};

export const calcAllAmts = (parts: CurrentPart[], labour: CurrentLabour[]) => {
  let subTotal = 0;
  let discountAmt = 0;
  let amount = 0;

  parts.map((part: CurrentPart) => {
    subTotal = roundToTwoDecimals(subTotal + part.subTotal);
    discountAmt = roundToTwoDecimals(discountAmt + (part.discountAmt || 0));
    amount = roundToTwoDecimals(amount + part.amount);
  });

  // console.log("TOTALS AFTER PARTS - ", subTotal, discountAmt, amount);

  labour.map((work: CurrentLabour) => {
    subTotal = roundToTwoDecimals(subTotal + work.subTotal);
    discountAmt = roundToTwoDecimals(discountAmt + (work.discountAmt || 0));
    amount = roundToTwoDecimals(amount + work.amount);
  });

  // console.log("TOTALS AFTER LABOUR - ", subTotal, discountAmt, amount);

  subTotal = roundToTwoDecimals(subTotal);
  discountAmt = roundToTwoDecimals(discountAmt);
  amount = roundToTwoDecimals(amount);

  return { subTotal, discountAmt, amount };
};

export const getUserAccess = (user: UserType) => {
  // console.log("USER ACCESS - ", user);
  return user.labels[0];
};

export const splitInsuranceAmt = (amount: number, insurance: number) => {
  // console.log("USER ACCESS - ", user);
  let insuranceAmt = (insurance / 100) * amount;
  let customerAmt = amount - insuranceAmt;

  return { insuranceAmt, customerAmt };
};

export const roundToTwoDecimals = (num: number) => {
  // return (Math.round(num * 100) / 100);n
  return parseFloat(num.toFixed(2));
};
export function preciseOperation(operation: string, ...numbers: number[]) {
  const result = numbers.reduce((acc, num) => {
    if (operation === "add") {
      return acc + num;
    } else if (operation === "subtract") {
      return acc - num;
    }
    throw new Error("Unsupported operation. Use 'add' or 'subtract'.");
  }, 0);

  return parseFloat((result + Number.EPSILON).toFixed(2));
}

export const getSubTotal = (mrp: number, quantity: number) => {
  return mrp * quantity;
};

export const getTaxAmount = (subTotal: number, rate: number) => {
  return roundToTwoDecimals(subTotal * (rate / 100));
};

export const getDiscount = (subTotal: number, rate: number) => {
  return roundToTwoDecimals(subTotal * (rate / 100));
};

export const createTempPartObj = (item: Part) => {
  if (item) {
    let tempSubTotal = roundToTwoDecimals(getSubTotal(item.mrp, 1));
    let tempCgstAmt = roundToTwoDecimals(getTaxAmount(tempSubTotal, item.cgst));
    let tempSgstAmt = roundToTwoDecimals(getTaxAmount(tempSubTotal, item.sgst));

    let returnObj: CurrentPart = {
      partId: item.$id,
      partName: item.partName,
      partNumber: item.partNumber,
      mrp: item.mrp,
      gst: item.gst,
      hsn: item.hsn,
      cgst: item.cgst,
      sgst: item.sgst,
      quantity: 1,
      subTotal: tempSubTotal,
      cgstAmt: tempCgstAmt,
      sgstAmt: tempSgstAmt,
      totalTax: tempCgstAmt + tempSgstAmt,
      amount: tempSubTotal + tempCgstAmt + tempSgstAmt,
    };

    return returnObj;
  }
};

export const createTempPartZeroObj = (item: CurrentPart) => {
  if (item) {
    // (item.mrp = 0),
    //   (item.subTotal = 0),
    //   (item.totalTax = 0),
    //   (item.amount = 0),
    //   (item.cgstAmt = 0);
    item.amount = 0;
    item.sgstAmt = 0;
    item.mrp = 0;
    item.subTotal = 0;
    item.totalTax = 0;
    item.cgstAmt = 0;

    return item;
  }
};
export const createTempLabourZeroObj = (item: CurrentLabour) => {
  if (item) {
    // (item.mrp = 0),
    //   (item.subTotal = 0),
    //   (item.totalTax = 0),
    //   (item.amount = 0),
    //   (item.cgstAmt = 0);
    item.amount = 0;

    item.sgstAmt = 0;
    item.mrp = 0;
    item.subTotal = 0;
    item.totalTax = 0;
    item.cgstAmt = 0;

    return item;
  }
};

export const changeMiscName = (item: CurrentLabour, labourName: string) => {
  if (item) {
    item.labourName = labourName;
    return item;
  }
};

export const createTempLabourObj = (item: Labour) => {
  if (item) {
    let tempSubTotal = roundToTwoDecimals(getSubTotal(item.mrp, 1));
    let tempCgstAmt = roundToTwoDecimals(getTaxAmount(tempSubTotal, item.cgst));
    let tempSgstAmt = roundToTwoDecimals(getTaxAmount(tempSubTotal, item.sgst));

    let returnObj: CurrentLabour = {
      labourId: item.$id,
      labourName: item.labourName,
      labourCode: item.labourCode,
      mrp: item.mrp,
      gst: item.gst,
      hsn: item.hsn,
      cgst: item.cgst,
      sgst: item.sgst,
      quantity: 1,
      subTotal: tempSubTotal,
      cgstAmt: tempCgstAmt,
      sgstAmt: tempSgstAmt,
      totalTax: tempCgstAmt + tempSgstAmt,
      amount: tempSubTotal + tempCgstAmt + tempSgstAmt,
    };

    return returnObj;
  }
};

export const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export const calculateJobCardAmt = (
  currentParts: CurrentPart[],
  currentLabour: CurrentLabour[]
) => {
  let partsTotal = 0;
  let labourTotal = 0;
  let total = 0;

  currentParts.map((part: CurrentPart) => {
    total = total + part.amount;
    partsTotal = partsTotal + part.amount;
  });

  currentLabour.map((work: CurrentLabour) => {
    total = total + work.amount;
    labourTotal = labourTotal + work.amount;
  });

  return {
    partsTotal: partsTotal,
    labourTotal: labourTotal,
    jobCardTotal: total,
  };
};

export const updateTempPartObjQuantity = (
  currentPartObj: CurrentPart,
  quantity: number
) => {
  if (currentPartObj && quantity) {
    let newQuantity;

    if (quantity > 0) {
      newQuantity = currentPartObj.quantity + 1;
    } else {
      newQuantity = currentPartObj.quantity - 1;
    }

    let tempSubTotal, actualSubTotal;

    if (
      currentPartObj.discountPercentage &&
      currentPartObj.discountPercentage > 0
    ) {
      // console.log("HAI DISCOUNT", currentPartObj.discountPercentage);
      actualSubTotal = roundToTwoDecimals(
        getSubTotal(currentPartObj.mrp, newQuantity)
      );
      let discountAmt = roundToTwoDecimals(
        getDiscount(actualSubTotal, currentPartObj.discountPercentage)
      );

      tempSubTotal = actualSubTotal - discountAmt;
      currentPartObj.discountAmt = discountAmt;
    } else {
      actualSubTotal = roundToTwoDecimals(
        getSubTotal(currentPartObj.mrp, newQuantity)
      );
      tempSubTotal = actualSubTotal;
    }
    let tempCgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentPartObj.cgst)
    );
    let tempSgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentPartObj.sgst)
    );

    // console.log(
    //   "TEMP OBJECTS = " + tempCgstAmt,
    //   tempSgstAmt,
    //   tempCgstAmt + tempSgstAmt
    // );

    currentPartObj.quantity = newQuantity;
    currentPartObj.subTotal = actualSubTotal;
    currentPartObj.cgstAmt = tempCgstAmt;
    currentPartObj.sgstAmt = tempSgstAmt;
    currentPartObj.totalTax = tempCgstAmt + tempSgstAmt;
    currentPartObj.amount = tempSubTotal + tempCgstAmt + tempSgstAmt;

    return currentPartObj;
  }
};

export const updateTempPartObjMRP = (
  currentPartObj: CurrentPart,
  mrp: number
) => {
  if (currentPartObj && mrp) {
    let newMRP;

    let tempSubTotal, actualSubTotal;

    if (
      currentPartObj.discountPercentage &&
      currentPartObj.discountPercentage > 0
    ) {
      // console.log("HAI DISCOUNT", currentPartObj.discountPercentage);
      actualSubTotal = roundToTwoDecimals(
        getSubTotal(mrp, currentPartObj.quantity)
      );
      let discountAmt = roundToTwoDecimals(
        getDiscount(actualSubTotal, currentPartObj.discountPercentage)
      );

      tempSubTotal = actualSubTotal - discountAmt;
      currentPartObj.discountAmt = discountAmt;
    } else {
      actualSubTotal = roundToTwoDecimals(
        getSubTotal(mrp, currentPartObj.quantity)
      );
      tempSubTotal = actualSubTotal;
    }
    let tempCgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentPartObj.cgst)
    );
    let tempSgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentPartObj.sgst)
    );

    // console.log(
    //   "TEMP OBJECTS = " + tempCgstAmt,
    //   tempSgstAmt,
    //   tempCgstAmt + tempSgstAmt
    // );

    // currentPartObj.quantity = currentPartObj.quantity;
    currentPartObj.mrp = mrp;
    currentPartObj.subTotal = actualSubTotal;
    currentPartObj.cgstAmt = tempCgstAmt;
    currentPartObj.sgstAmt = tempSgstAmt;
    currentPartObj.totalTax = tempCgstAmt + tempSgstAmt;
    currentPartObj.amount = tempSubTotal + tempCgstAmt + tempSgstAmt;

    return currentPartObj;
  }
};

export const updateTempLabourObjMRP = (
  currentLabourObj: CurrentLabour,
  mrp: number
) => {
  if (currentLabourObj && mrp) {
    let newMRP;

    let tempSubTotal, actualSubTotal;

    if (
      currentLabourObj.discountPercentage &&
      currentLabourObj.discountPercentage > 0
    ) {
      // console.log("HAI DISCOUNT", currentPartObj.discountPercentage);
      actualSubTotal = roundToTwoDecimals(
        getSubTotal(mrp, currentLabourObj.quantity)
      );
      let discountAmt = roundToTwoDecimals(
        getDiscount(actualSubTotal, currentLabourObj.discountPercentage)
      );

      tempSubTotal = actualSubTotal - discountAmt;
      currentLabourObj.discountAmt = discountAmt;
    } else {
      actualSubTotal = roundToTwoDecimals(
        getSubTotal(mrp, currentLabourObj.quantity)
      );
      tempSubTotal = actualSubTotal;
    }
    let tempCgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentLabourObj.cgst)
    );
    let tempSgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentLabourObj.sgst)
    );

    // console.log(
    //   "TEMP OBJECTS = " + tempCgstAmt,
    //   tempSgstAmt,
    //   tempCgstAmt + tempSgstAmt
    // );

    // currentLabourObj.quantity = currentLabourObj.quantity;
    currentLabourObj.mrp = mrp;
    currentLabourObj.subTotal = actualSubTotal;
    currentLabourObj.cgstAmt = tempCgstAmt;
    currentLabourObj.sgstAmt = tempSgstAmt;
    currentLabourObj.totalTax = tempCgstAmt + tempSgstAmt;
    currentLabourObj.amount = tempSubTotal + tempCgstAmt + tempSgstAmt;

    return currentLabourObj;
  }
};

export const updateTempLabourObjQuantity = (
  currentLabourObj: CurrentLabour,
  quantity: number
) => {
  if (currentLabourObj && quantity) {
    let newQuantity;

    if (quantity > 0) {
      newQuantity = currentLabourObj.quantity + 1;
    } else {
      newQuantity = currentLabourObj.quantity - 1;
    }

    let tempSubTotal, actualSubTotal;

    if (
      currentLabourObj.discountPercentage &&
      currentLabourObj.discountPercentage > 0
    ) {
      // console.log("HAI DISCOUNT", currentLabourObj.discountPercentage);
      actualSubTotal = roundToTwoDecimals(
        getSubTotal(currentLabourObj.mrp, newQuantity)
      );
      let discountAmt = roundToTwoDecimals(
        getDiscount(actualSubTotal, currentLabourObj.discountPercentage)
      );

      tempSubTotal = actualSubTotal - discountAmt;
      currentLabourObj.discountAmt = discountAmt;
    } else {
      actualSubTotal = roundToTwoDecimals(
        getSubTotal(currentLabourObj.mrp, newQuantity)
      );
      tempSubTotal = actualSubTotal;
    }
    let tempCgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentLabourObj.cgst)
    );
    let tempSgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentLabourObj.sgst)
    );

    // console.log("TEMP OBJECTS = ", tempSubTotal, tempCgstAmt, tempSgstAmt);

    currentLabourObj.quantity = newQuantity;
    currentLabourObj.subTotal = actualSubTotal;
    currentLabourObj.cgstAmt = tempCgstAmt;
    currentLabourObj.sgstAmt = tempSgstAmt;
    currentLabourObj.totalTax = tempCgstAmt + tempSgstAmt;
    currentLabourObj.amount = tempSubTotal + tempCgstAmt + tempSgstAmt;

    return currentLabourObj;
  }
};

export const updateTempPartObjDiscount = (
  currentPartObj: CurrentPart,
  discountPercentage: number
) => {
  if (currentPartObj && discountPercentage) {
    let discountAmt = roundToTwoDecimals(
      getDiscount(currentPartObj.subTotal, discountPercentage)
    );
    let tempSubTotal = roundToTwoDecimals(
      currentPartObj.subTotal - discountAmt
    );
    let tempCgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentPartObj.cgst)
    );
    let tempSgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentPartObj.sgst)
    );

    // console.log("TEMP OBJECTS = ", tempSubTotal, tempCgstAmt, tempSgstAmt);

    currentPartObj.discountPercentage = discountPercentage;
    currentPartObj.discountAmt = discountAmt;
    currentPartObj.cgstAmt = tempCgstAmt;
    currentPartObj.sgstAmt = tempSgstAmt;
    currentPartObj.totalTax = tempCgstAmt + tempSgstAmt;
    currentPartObj.amount = tempSubTotal + tempCgstAmt + tempSgstAmt;

    return currentPartObj;
  }
};

export const updateTempLabourObjDiscount = (
  currentLabourObj: CurrentLabour,
  discountPercentage: number
) => {
  if (currentLabourObj && discountPercentage) {
    let discountAmt = roundToTwoDecimals(
      getDiscount(currentLabourObj.subTotal, discountPercentage)
    );
    let tempSubTotal = roundToTwoDecimals(
      currentLabourObj.subTotal - discountAmt
    );
    let tempCgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentLabourObj.cgst)
    );
    let tempSgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentLabourObj.sgst)
    );

    // console.log("TEMP OBJECTS = ", tempSubTotal, tempCgstAmt, tempSgstAmt);

    currentLabourObj.discountPercentage = discountPercentage;
    currentLabourObj.discountAmt = discountAmt;
    currentLabourObj.cgstAmt = tempCgstAmt;
    currentLabourObj.sgstAmt = tempSgstAmt;
    currentLabourObj.totalTax = tempCgstAmt + tempSgstAmt;
    currentLabourObj.amount = tempSubTotal + tempCgstAmt + tempSgstAmt;

    return currentLabourObj;
  }
};

export const removeTempPartObjDiscount = (currentPartObj: CurrentPart) => {
  if (currentPartObj) {
    let tempSubTotal = currentPartObj.subTotal;
    let tempCgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentPartObj.cgst)
    );
    let tempSgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentPartObj.sgst)
    );

    // console.log("TEMP OBJECTS = ", tempSubTotal, tempCgstAmt, tempSgstAmt);

    currentPartObj.discountPercentage = 0;
    currentPartObj.discountAmt = 0;
    currentPartObj.cgstAmt = tempCgstAmt;
    currentPartObj.sgstAmt = tempSgstAmt;
    currentPartObj.totalTax = tempCgstAmt + tempSgstAmt;
    currentPartObj.amount = tempSubTotal + tempCgstAmt + tempSgstAmt;

    return currentPartObj;
  }
};

export const removeTempLabourObjDiscount = (
  currentLabourObj: CurrentLabour
) => {
  if (currentLabourObj) {
    let tempSubTotal = currentLabourObj.subTotal;
    let tempCgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentLabourObj.cgst)
    );
    let tempSgstAmt = roundToTwoDecimals(
      getTaxAmount(tempSubTotal, currentLabourObj.sgst)
    );

    // console.log("TEMP OBJECTS = ", tempSubTotal, tempCgstAmt, tempSgstAmt);

    currentLabourObj.discountPercentage = 0;
    currentLabourObj.discountAmt = 0;
    currentLabourObj.cgstAmt = tempCgstAmt;
    currentLabourObj.sgstAmt = tempSgstAmt;
    currentLabourObj.totalTax = tempCgstAmt + tempSgstAmt;
    currentLabourObj.amount = tempSubTotal + tempCgstAmt + tempSgstAmt;

    return currentLabourObj;
  }
};

export async function streamToBuffer(
  stream: NodeJS.ReadableStream
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export function bufferToStream(buffer: Buffer) {
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(buffer);
      controller.close();
    },
  });
  return readable;
}

export const createTaxObj = (
  parts: CurrentPart[],
  labour: CurrentLabour[],
  isInsurance?: boolean,
  liabilityType?: string
) => {
  let taxes: TaxObj[] = [];

  // console.log("GETTING DETAILS - ", isInsurance, liabilityType)

  parts.map((part: CurrentPart) => {
    // if(part.cgst == 14){
    //   console.log("PARTS - ", part)
    // }
    let foundCgstObjIndex = taxes.findIndex(
      (obj: TaxObj) =>
        obj.taxName == "CGST" &&
        obj.taxRate == part.cgst &&
        obj.taxType == "GOODS"
    );

    let foundSgstObjIndex = taxes.findIndex(
      (obj: TaxObj) =>
        obj.taxName == "SGST" &&
        obj.taxRate == part.sgst &&
        obj.taxType == "GOODS"
    );

    if (foundCgstObjIndex != -1) {
      let arrayFirstHalf = taxes!.slice(0, foundCgstObjIndex);
      let arraySecondHalf = taxes!.slice(foundCgstObjIndex + 1);

      if (
        isInsurance &&
        part.insurancePercentage &&
        part.insurancePercentage != 0
      ) {
        const splitPartCGST = splitInsuranceAmt(
          part.cgstAmt,
          part.insurancePercentage
        );

        // console.log("ANDAR AA RAHA HAI", splitPartCGST);

        if (liabilityType == "Customer") {
          taxes[foundCgstObjIndex].taxAmt = roundToTwoDecimals(
            taxes[foundCgstObjIndex].taxAmt + splitPartCGST.customerAmt
          );
        } else {
          taxes[foundCgstObjIndex].taxAmt = roundToTwoDecimals(
            taxes[foundCgstObjIndex].taxAmt + splitPartCGST.insuranceAmt
          );
        }
      } else {
        if (liabilityType) {
          if (liabilityType == "Customer") {
            taxes[foundCgstObjIndex].taxAmt = roundToTwoDecimals(
              taxes[foundCgstObjIndex].taxAmt + part.cgstAmt
            );
          } else {
            taxes[foundCgstObjIndex].taxAmt = roundToTwoDecimals(
              taxes[foundCgstObjIndex].taxAmt + 0
            );
          }
        } else {
          taxes[foundCgstObjIndex].taxAmt = roundToTwoDecimals(
            taxes[foundCgstObjIndex].taxAmt + part.cgstAmt
          );
        }
      }

      // console.log("TAX OBJ EDITED- ", taxes[foundCgstObjIndex]);

      taxes = [...arrayFirstHalf, taxes[foundCgstObjIndex], ...arraySecondHalf];
    } else {
      let calculatedCGSTAmt = 0;

      if (
        isInsurance &&
        part.insurancePercentage &&
        part.insurancePercentage != 0
      ) {
        const splitPartCGST = splitInsuranceAmt(
          part.cgstAmt,
          part.insurancePercentage
        );

        // console.log("ANDAR AA RAHA HAI NEW", splitPartCGST);

        if (liabilityType == "Customer") {
          calculatedCGSTAmt = roundToTwoDecimals(
            calculatedCGSTAmt + splitPartCGST.customerAmt
          );
          // console.log("CUSTOMER BHI AA RAHA HAI", calculatedCGSTAmt);
        } else {
          calculatedCGSTAmt = roundToTwoDecimals(
            calculatedCGSTAmt + splitPartCGST.insuranceAmt
          );
        }
      } else {
        // console.log("ANDAR NAHI AAYA");
        if (liabilityType) {
          if (liabilityType == "Customer") {
            calculatedCGSTAmt = roundToTwoDecimals(
              calculatedCGSTAmt + part.cgstAmt
            );
          } else {
            calculatedCGSTAmt = roundToTwoDecimals(calculatedCGSTAmt + 0);
          }
        } else {
          calculatedCGSTAmt = roundToTwoDecimals(
            calculatedCGSTAmt + part.cgstAmt
          );
        }
      }

      let cgstObj = {
        taxType: "GOODS",
        taxRate: part.cgst,
        taxName: "CGST",
        taxAmt: calculatedCGSTAmt,
      };

      // console.log("TAX OBJ NEW- ", calculatedCGSTAmt, cgstObj);

      taxes.push(cgstObj);
    }

    if (foundSgstObjIndex != -1) {
      let arrayFirstHalf = taxes!.slice(0, foundSgstObjIndex);
      let arraySecondHalf = taxes!.slice(foundSgstObjIndex + 1);

      if (
        isInsurance &&
        part.insurancePercentage &&
        part.insurancePercentage != 0
      ) {
        const splitPartSGST = splitInsuranceAmt(
          part.sgstAmt,
          part.insurancePercentage
        );

        if (liabilityType == "Customer") {
          taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
            taxes[foundSgstObjIndex].taxAmt + splitPartSGST.customerAmt
          );
        } else {
          taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
            taxes[foundSgstObjIndex].taxAmt + splitPartSGST.insuranceAmt
          );
        }
      } else {
        if (liabilityType) {
          if (liabilityType == "Customer") {
            taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
              taxes[foundSgstObjIndex].taxAmt + part.sgstAmt
            );
          } else {
            taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
              taxes[foundSgstObjIndex].taxAmt + 0
            );
          }
        } else {
          taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
            taxes[foundSgstObjIndex].taxAmt + part.sgstAmt
          );
        }
      }

      // console.log("TAX OBJ EDITED- ", taxes[foundSgstObjIndex]);

      taxes = [...arrayFirstHalf, taxes[foundSgstObjIndex], ...arraySecondHalf];
    } else {
      let calculatedSGSTAmt = 0;

      if (
        isInsurance &&
        part.insurancePercentage &&
        part.insurancePercentage != 0
      ) {
        const splitPartSGST = splitInsuranceAmt(
          part.sgstAmt,
          part.insurancePercentage
        );

        // console.log("ANDAR AA RAHA HAI NEW", splitPartSGST);

        if (liabilityType == "Customer") {
          calculatedSGSTAmt = roundToTwoDecimals(
            calculatedSGSTAmt + splitPartSGST.customerAmt
          );
          // console.log("CUSTOMER BHI AA RAHA HAI", calculatedSGSTAmt);
        } else {
          calculatedSGSTAmt = roundToTwoDecimals(
            calculatedSGSTAmt + splitPartSGST.insuranceAmt
          );
        }
      } else {
        if (liabilityType) {
          if (liabilityType == "Customer") {
            calculatedSGSTAmt = roundToTwoDecimals(
              calculatedSGSTAmt + part.sgstAmt
            );
          } else {
            calculatedSGSTAmt = roundToTwoDecimals(calculatedSGSTAmt + 0);
          }
        } else {
          calculatedSGSTAmt = roundToTwoDecimals(
            calculatedSGSTAmt + part.sgstAmt
          );
        }
      }

      let sgstObj = {
        taxType: "GOODS",
        taxRate: part.sgst,
        taxName: "SGST",
        taxAmt: calculatedSGSTAmt,
      };

      // console.log("TAX OBJ NEW- ", calculatedSGSTAmt, sgstObj);

      taxes.push(sgstObj);
    }
    // console.log("TAXES CHECK - ", taxes[0], taxes[1]);
  });

  labour.map((work: CurrentLabour) => {
    let foundCgstObjIndex = taxes.findIndex(
      (obj: TaxObj) =>
        obj.taxName == "CGST" &&
        obj.taxRate == work.cgst &&
        obj.taxType == "SERVICES"
    );

    let foundSgstObjIndex = taxes.findIndex(
      (obj: TaxObj) =>
        obj.taxName == "SGST" &&
        obj.taxRate == work.sgst &&
        obj.taxType == "SERVICES"
    );

    if (foundCgstObjIndex != -1) {
      let arrayFirstHalf = taxes!.slice(0, foundCgstObjIndex);
      let arraySecondHalf = taxes!.slice(foundCgstObjIndex + 1);

      if (
        isInsurance &&
        work.insurancePercentage &&
        work.insurancePercentage != 0
      ) {
        const splitPartCGST = splitInsuranceAmt(
          work.cgstAmt,
          work.insurancePercentage
        );

        if (liabilityType == "Customer") {
          taxes[foundCgstObjIndex].taxAmt = roundToTwoDecimals(
            taxes[foundCgstObjIndex].taxAmt + splitPartCGST.customerAmt
          );
        } else {
          taxes[foundCgstObjIndex].taxAmt = roundToTwoDecimals(
            taxes[foundCgstObjIndex].taxAmt + splitPartCGST.insuranceAmt
          );
        }
      } else {
        if (liabilityType) {
          if (liabilityType == "Customer") {
            taxes[foundCgstObjIndex].taxAmt = roundToTwoDecimals(
              taxes[foundCgstObjIndex].taxAmt + work.cgstAmt
            );
          } else {
            taxes[foundCgstObjIndex].taxAmt = roundToTwoDecimals(
              taxes[foundCgstObjIndex].taxAmt + 0
            );
          }
        } else {
          taxes[foundCgstObjIndex].taxAmt = roundToTwoDecimals(
            taxes[foundCgstObjIndex].taxAmt + work.cgstAmt
          );
        }
      }

      // console.log("TAX OBJ EDITED- ", taxes[foundCgstObjIndex]);

      taxes = [...arrayFirstHalf, taxes[foundCgstObjIndex], ...arraySecondHalf];
    } else {
      let calculatedCGSTAmt = 0;

      if (
        isInsurance &&
        work.insurancePercentage &&
        work.insurancePercentage != 0
      ) {
        const splitPartCGST = splitInsuranceAmt(
          work.cgstAmt,
          work.insurancePercentage
        );

        // console.log("ANDAR AA RAHA HAI NEW", splitPartCGST);

        if (liabilityType == "Customer") {
          calculatedCGSTAmt = roundToTwoDecimals(
            calculatedCGSTAmt + splitPartCGST.customerAmt
          );
          // console.log("CUSTOMER BHI AA RAHA HAI", calculatedCGSTAmt);
        } else {
          calculatedCGSTAmt = roundToTwoDecimals(
            calculatedCGSTAmt + splitPartCGST.insuranceAmt
          );
        }
      } else {
        // console.log("ANDAR NAHI AAYA");
        if (liabilityType) {
          if (liabilityType == "Customer") {
            calculatedCGSTAmt = roundToTwoDecimals(
              calculatedCGSTAmt + work.cgstAmt
            );
          } else {
            calculatedCGSTAmt = roundToTwoDecimals(calculatedCGSTAmt + 0);
          }
        } else {
          calculatedCGSTAmt = roundToTwoDecimals(
            calculatedCGSTAmt + work.cgstAmt
          );
        }
      }

      let cgstObj = {
        taxType: "SERVICES",
        taxRate: work.cgst,
        taxName: "CGST",
        taxAmt: calculatedCGSTAmt,
      };

      // console.log("TAX OBJ NEW- ", calculatedCGSTAmt, cgstObj);

      taxes.push(cgstObj);
    }

    if (foundSgstObjIndex != -1) {
      let arrayFirstHalf = taxes!.slice(0, foundSgstObjIndex);
      let arraySecondHalf = taxes!.slice(foundSgstObjIndex + 1);

      if (
        isInsurance &&
        work.insurancePercentage &&
        work.insurancePercentage != 0
      ) {
        const splitPartSGST = splitInsuranceAmt(
          work.sgstAmt,
          work.insurancePercentage
        );

        if (liabilityType == "Customer") {
          taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
            taxes[foundSgstObjIndex].taxAmt + splitPartSGST.customerAmt
          );
        } else {
          taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
            taxes[foundSgstObjIndex].taxAmt + splitPartSGST.insuranceAmt
          );
        }
      } else {
        if (liabilityType) {
          if (liabilityType == "Customer") {
            taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
              taxes[foundSgstObjIndex].taxAmt + work.sgstAmt
            );
          } else {
            taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
              taxes[foundSgstObjIndex].taxAmt + 0
            );
          }
        } else {
          taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
            taxes[foundSgstObjIndex].taxAmt + work.sgstAmt
          );
        }
      }

      // console.log("TAX OBJ EDITED- ", taxes[foundSgstObjIndex]);

      taxes = [...arrayFirstHalf, taxes[foundSgstObjIndex], ...arraySecondHalf];
    } else {
      let calculatedSGSTAmt = 0;

      if (
        isInsurance &&
        work.insurancePercentage &&
        work.insurancePercentage != 0
      ) {
        const splitPartSGST = splitInsuranceAmt(
          work.sgstAmt,
          work.insurancePercentage
        );

        // console.log("ANDAR AA RAHA HAI NEW", splitPartSGST);

        if (liabilityType == "Customer") {
          calculatedSGSTAmt = roundToTwoDecimals(
            calculatedSGSTAmt + splitPartSGST.customerAmt
          );
          // console.log("CUSTOMER BHI AA RAHA HAI", calculatedSGSTAmt);
        } else {
          calculatedSGSTAmt = roundToTwoDecimals(
            calculatedSGSTAmt + splitPartSGST.insuranceAmt
          );
        }
      } else {
        if (liabilityType) {
          if (liabilityType == "Customer") {
            calculatedSGSTAmt = roundToTwoDecimals(
              calculatedSGSTAmt + work.sgstAmt
            );
          } else {
            calculatedSGSTAmt = roundToTwoDecimals(calculatedSGSTAmt + 0);
          }
        } else {
          calculatedSGSTAmt = roundToTwoDecimals(
            calculatedSGSTAmt + work.sgstAmt
          );
        }
      }

      let sgstObj = {
        taxType: "SERVICES",
        taxRate: work.sgst,
        taxName: "SGST",
        taxAmt: calculatedSGSTAmt,
      };

      taxes.push(sgstObj);
    }
  });

  return taxes;
};

export const createTaxObjNew = (
  parts: CurrentPart[],
  labour: CurrentLabour[]
) => {
  let taxes: TaxObj[] = [];

  // console.log("GETTING DETAILS - ", isInsurance, liabilityType)

  parts.map((part: CurrentPart) => {
    // if(part.cgst == 14){
    //   console.log("PARTS - ", part)
    // }
    let foundCgstObjIndex = taxes.findIndex(
      (obj: TaxObj) =>
        obj.taxName == "CGST" &&
        obj.taxRate == part.cgst &&
        obj.taxType == "GOODS"
    );

    let foundSgstObjIndex = taxes.findIndex(
      (obj: TaxObj) =>
        obj.taxName == "SGST" &&
        obj.taxRate == part.sgst &&
        obj.taxType == "GOODS"
    );

    if (foundCgstObjIndex != -1) {
      let arrayFirstHalf = taxes!.slice(0, foundCgstObjIndex);
      let arraySecondHalf = taxes!.slice(foundCgstObjIndex + 1);

      taxes[foundCgstObjIndex].taxAmt = roundToTwoDecimals(
        taxes[foundCgstObjIndex].taxAmt + part.cgstAmt
      );

      taxes = [...arrayFirstHalf, taxes[foundCgstObjIndex], ...arraySecondHalf];
    } else {
      let cgstObj = {
        taxType: "GOODS",
        taxRate: part.cgst,
        taxName: "CGST",
        taxAmt: part.cgstAmt,
      };

      taxes.push(cgstObj);
    }

    if (foundSgstObjIndex != -1) {
      let arrayFirstHalf = taxes!.slice(0, foundSgstObjIndex);
      let arraySecondHalf = taxes!.slice(foundSgstObjIndex + 1);

      taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
        taxes[foundSgstObjIndex].taxAmt + part.sgstAmt
      );

      taxes = [...arrayFirstHalf, taxes[foundSgstObjIndex], ...arraySecondHalf];
    } else {
      let sgstObj = {
        taxType: "GOODS",
        taxRate: part.sgst,
        taxName: "SGST",
        taxAmt: part.sgstAmt,
      };

      // console.log("TAX OBJ NEW- ", calculatedSGSTAmt, sgstObj);

      taxes.push(sgstObj);
    }
    // console.log("TAXES CHECK - ", taxes[0], taxes[1]);
  });

  labour.map((work: CurrentLabour) => {
    let foundCgstObjIndex = taxes.findIndex(
      (obj: TaxObj) =>
        obj.taxName == "CGST" &&
        obj.taxRate == work.cgst &&
        obj.taxType == "SERVICES"
    );

    let foundSgstObjIndex = taxes.findIndex(
      (obj: TaxObj) =>
        obj.taxName == "SGST" &&
        obj.taxRate == work.sgst &&
        obj.taxType == "SERVICES"
    );

    if (foundCgstObjIndex != -1) {
      let arrayFirstHalf = taxes!.slice(0, foundCgstObjIndex);
      let arraySecondHalf = taxes!.slice(foundCgstObjIndex + 1);

      taxes[foundCgstObjIndex].taxAmt = roundToTwoDecimals(
        taxes[foundCgstObjIndex].taxAmt + work.cgstAmt
      );

      taxes = [...arrayFirstHalf, taxes[foundCgstObjIndex], ...arraySecondHalf];
    } else {
      let cgstObj = {
        taxType: "SERVICES",
        taxRate: work.cgst,
        taxName: "CGST",
        taxAmt: work.cgstAmt,
      };

      // console.log("TAX OBJ NEW- ", calculatedCGSTAmt, cgstObj);

      taxes.push(cgstObj);
    }

    if (foundSgstObjIndex != -1) {
      let arrayFirstHalf = taxes!.slice(0, foundSgstObjIndex);
      let arraySecondHalf = taxes!.slice(foundSgstObjIndex + 1);

      taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
        taxes[foundSgstObjIndex].taxAmt + work.sgstAmt
      );

      // console.log("TAX OBJ EDITED- ", taxes[foundSgstObjIndex]);

      taxes = [...arrayFirstHalf, taxes[foundSgstObjIndex], ...arraySecondHalf];
    } else {
      let sgstObj = {
        taxType: "SERVICES",
        taxRate: work.sgst,
        taxName: "SGST",
        taxAmt: work.sgstAmt,
      };

      taxes.push(sgstObj);
    }
  });

  return taxes;
};

export const curateInvoices = (invoices: Invoice[]) => {
  let invoiceArr: any[] = [];

  // console.log("ACTUAL", invoices.length);

  const groupedByJobCardId = invoices.reduce((acc: any, invoice: any) => {
    const jobCardId = invoice.jobCardId;
    if (!acc[jobCardId]) {
      acc[jobCardId] = [];
    }
    acc[jobCardId].push(invoice);
    return acc;
  }, {});

  let total = 0;

  Object.keys(groupedByJobCardId).map((key) => {
    const latestInvoices = getLatestInvoices(groupedByJobCardId[key]);
    total = total + groupedByJobCardId[key].length;
    invoiceArr = [...invoiceArr, ...latestInvoices];
  });

  invoiceArr.sort((a, b) =>
    a.invoiceNumber > b.invoiceNumber
      ? 1
      : b.invoiceNumber > a.invoiceNumber
      ? -1
      : 0
  );

  return invoiceArr;
};

export const getLatestInvoices = (invoices: Invoice[]) => {
  const latestInvoices: Record<string, any> = {};

  invoices.forEach((invoice: any) => {
    const { invoiceType, $createdAt, insuranceInvoiceType } = invoice;

    // Create a unique key for each combination of invoiceType and insuranceInvoiceType
    const key = insuranceInvoiceType
      ? `${invoiceType}-${insuranceInvoiceType}`
      : invoiceType;

    // Ensure `$createdAt` is valid
    if (!$createdAt) {
      console.warn(
        `Invoice with key ${key} has no '$createdAt' field:`,
        invoice
      );
      return;
    }

    if (!latestInvoices[key]) {
      // Initialize with the first invoice for this key
      latestInvoices[key] = invoice;
    } else {
      // Compare timestamps to find the latest
      const currentTimestamp = new Date($createdAt).getTime();
      const existingTimestamp = new Date(
        latestInvoices[key].$createdAt
      ).getTime();

      if (currentTimestamp > existingTimestamp) {
        latestInvoices[key] = invoice;
      }
    }
  });

  // Validate final output to ensure no duplicate keys
  const uniqueInvoices = Object.values(latestInvoices);
  // console.log("Final Unique Invoices:", uniqueInvoices);

  return uniqueInvoices; // Return only the latest invoices
};

export function roundDecimal(value: any) {
  return new Decimal(value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}

export const processItem = async (
  itemType: "Part" | "Labour",
  item: CurrentPart | CurrentLabour,
  invoice: Invoice
) => {
  return new Promise((resolve, reject) => {
    try {
      let tempSubTotal = new Decimal(0);
      let liabilitySubtotalWithoutDisc = new Decimal(0);
      let discountedSubtotal = new Decimal(0);
      let liabilitySubtotal = new Decimal(0);

      let tempCgstAmt = new Decimal(0);
      let tempSgstAmt = new Decimal(0);

      let tempTotalTax = new Decimal(0);

      let tempAmount = new Decimal(0);

      // Convert inputs to Decimal
      const mrp = new Decimal(item["mrp"]);
      const quantity = new Decimal(item["quantity"]);
      const discountAmt = new Decimal(item["discountAmt"] || 0);
      const discountPercentage = new Decimal(item["discountPercentage"] || 0);
      const cgst = new Decimal(item["cgst"]);
      const sgst = new Decimal(item["sgst"]);
      const insurancePercentage = new Decimal(item["insurancePercentage"] || 0);
      const isInsuranceInvoice = invoice["isInsuranceInvoice"];
      const insuranceInvoiceType = invoice["insuranceInvoiceType"];

      // Calculate subtotal
      tempSubTotal = roundDecimal(mrp.times(quantity));

      // Calculate discounted subtotal
      if (item["discountPercentage"] && !discountAmt.isZero()) {
        discountedSubtotal = roundDecimal(tempSubTotal.minus(discountAmt));
      } else {
        discountedSubtotal = tempSubTotal;
      }

      // Calculate liability subtotal
      if (isInsuranceInvoice) {
        if (insuranceInvoiceType === "Customer") {
          liabilitySubtotal = roundDecimal(
            discountedSubtotal.times(
              new Decimal(1).minus(insurancePercentage.dividedBy(100))
            )
          );

          liabilitySubtotalWithoutDisc = roundDecimal(
            tempSubTotal.times(
              new Decimal(1).minus(insurancePercentage.dividedBy(100))
            )
          );
        } else {
          liabilitySubtotal = roundDecimal(
            discountedSubtotal.times(insurancePercentage.dividedBy(100))
          );

          liabilitySubtotalWithoutDisc = roundDecimal(
            tempSubTotal.times(insurancePercentage.dividedBy(100))
          );
        }
      } else {
        liabilitySubtotal = discountedSubtotal;
        liabilitySubtotalWithoutDisc = tempSubTotal;
      }

      // Calculate tax amounts
      tempCgstAmt = roundDecimal(cgst.dividedBy(100).times(liabilitySubtotal));
      tempSgstAmt = roundDecimal(sgst.dividedBy(100).times(liabilitySubtotal));

      // Calculate total tax and total amount
      tempTotalTax = roundDecimal(tempSgstAmt.plus(tempCgstAmt));
      tempAmount = roundDecimal(liabilitySubtotal.plus(tempTotalTax));

      let updatedItem = {
        mrp: item.mrp,
        gst: item.gst,
        hsn: item.hsn,
        cgst: item.cgst,
        sgst: item.sgst,
        quantity: item.quantity,
        subTotal: Number(liabilitySubtotalWithoutDisc),
        cgstAmt: Number(tempCgstAmt),
        sgstAmt: Number(tempSgstAmt),
        totalTax: Number(tempTotalTax),
        amount: Number(tempAmount),
        discountAmt: Number(discountAmt) || 0,
        discountPercentage: Number(discountPercentage) || 0,
      };

      if (itemType == "Part") {
        (updatedItem as CurrentPart).partId = (item as CurrentPart).partId;
        (updatedItem as CurrentPart).partName = (item as CurrentPart).partName;
        (updatedItem as CurrentPart).partNumber = (
          item as CurrentPart
        ).partNumber;
      } else {
        (updatedItem as CurrentLabour).labourId = (
          item as CurrentLabour
        ).labourId;
        (updatedItem as CurrentLabour).labourName = (
          item as CurrentLabour
        ).labourName;
        (updatedItem as CurrentLabour).labourCode = (
          item as CurrentLabour
        ).labourCode;
      }
      resolve(updatedItem);
    } catch (error) {
      reject(error);
    }
  });
};

export const createInvoiceObj = async (
  jobCard: JobCard,
  invoice: Invoice
): Promise<Invoice> => {
  return new Promise(async (resolve, reject) => {
    try {
      let partsArr = stringToObj(jobCard.parts);
      let labourArr = stringToObj(jobCard.labour);

      let partsTotal = new Decimal(0);
      let labourTotal = new Decimal(0);

      let partsSubtotal = new Decimal(0);
      let labourSubtotal = new Decimal(0);

      let partsDiscount = new Decimal(0);
      let labourDiscount = new Decimal(0);

      let totalTax = new Decimal(0);

      let insuranceDetails;

      if (invoice.isInsuranceInvoice && invoice.invoiceType != "Quote") {
        insuranceDetails = JSON.parse(jobCard.insuranceDetails);
        //   console.log(true);
      }

      const revisedPartsArr: any = await Promise.all(
        partsArr.map(async (part: CurrentPart) => {
          const updatedPart = await processItem("Part", part, invoice);

          partsTotal = roundDecimal(
            partsTotal.add(new Decimal((updatedPart as CurrentPart).amount))
          );
          partsSubtotal = roundDecimal(
            partsSubtotal.add(
              new Decimal((updatedPart as CurrentPart).subTotal)
            )
          );
          partsDiscount = roundDecimal(
            partsDiscount.add(
              new Decimal((updatedPart as CurrentPart).discountAmt!)
            )
          );
          totalTax = roundDecimal(
            totalTax.add(new Decimal((updatedPart as CurrentPart).totalTax))
          );

          return updatedPart;
        })
      );

      const revisedLabourArr: any = await Promise.all(
        labourArr.map(async (labour: CurrentLabour) => {
          const updatedLabour = await processItem("Labour", labour, invoice);

          labourTotal = roundDecimal(
            labourTotal.add(
              new Decimal((updatedLabour as CurrentLabour).amount)
            )
          );
          labourSubtotal = roundDecimal(
            labourSubtotal.add(
              new Decimal((updatedLabour as CurrentLabour).subTotal)
            )
          );
          labourDiscount = roundDecimal(
            labourDiscount.add(
              new Decimal((updatedLabour as CurrentLabour).discountAmt!)
            )
          );
          totalTax = roundDecimal(
            totalTax.add(new Decimal((updatedLabour as CurrentLabour).totalTax))
          );

          return updatedLabour;
        })
      );

      jobCard.parts = revisedPartsArr;
      jobCard.labour = revisedLabourArr;

      jobCard.subTotal = Number(
        roundDecimal(partsSubtotal.plus(labourSubtotal))
      );
      jobCard.amount = Number(roundDecimal(partsTotal.plus(labourTotal)));

      jobCard.totalDiscountAmt = Number(
        roundDecimal(partsDiscount.plus(labourDiscount))
      );
      jobCard.totalTax = Number(totalTax);
      jobCard.placeOfSupply = "Maharashtra";
      jobCard.totalRoundedOffAmount = Math.round(
        roundToTwoDecimals(
          jobCard.subTotal - jobCard.totalDiscountAmt + jobCard.totalTax
        )
      );
      jobCard.roundOffValue = roundToTwoDecimals(
        jobCard.totalRoundedOffAmount - jobCard.amount
      );

      if (
        invoice.isInsuranceInvoice &&
        invoice.invoiceType != "Quote" &&
        invoice.insuranceInvoiceType == "Insurance"
      ) {
        jobCard.gstin = insuranceDetails.policyProviderGST;
        jobCard.customerName = insuranceDetails.policyProvider;
        jobCard.customerAddress = insuranceDetails.policyProviderAddress;
        jobCard.customerPhone = "";
      }

      const taxesSplitObj = createTaxObjNew(revisedPartsArr, revisedLabourArr);

      jobCard.taxes = taxesSplitObj;

      const dateTemp = new Date(invoice["$createdAt"]);

      const dateExpandedObj: DateExpandedObj = await createDateExpandedObj(
        dateTemp
      );

      const todaysDate: DateExpandedObj = await createDateExpandedObj(
        new Date()
      );

      let checkDate;

      if (Number(todaysDate.day) >= 13) {
        checkDate = new Date(
          Number(todaysDate.year),
          Number(todaysDate.month) - 1,
          1
        );
      } else {
        if (Number(todaysDate.month) != 1) {
          checkDate = new Date(
            Number(todaysDate.year),
            Number(todaysDate.month) - 2,
            1
          );
        } else {
          checkDate = new Date(Number(todaysDate.year) - 1, 11, 1);
        }
      }

      if (dateTemp < checkDate) {
        invoice.isUpdatedInvoice = false;
      }

      invoice.invoiceDate = dateExpandedObj.formattedDate;

      invoice.jobCardDetails = jobCard;

      resolve(invoice);
    } catch (error) {
      reject(error);
    }
  });
};

export const manageTimelineChange = async ({
  currentSelectedTimeline,
  setSelectedTimeline,
}: any) => {
  const timelineIndex = adminReportTimelineDrop.findIndex(
    (timeline) => timeline.key === currentSelectedTimeline
  );

  setSelectedTimeline((prev: any) =>
    adminReportTimelineDrop[timelineIndex].value
      ? adminReportTimelineDrop[timelineIndex].value
      : prev
  );
};

export const createDateExpandedObj = async (
  date: Date
): Promise<DateExpandedObj> => {
  return new Promise((resolve, reject) => {
    try {
      const day = Number(String(date.getDate()).padStart(2, "0")); // Ensures 2 digits
      const month = Number(String(date.getMonth() + 1).padStart(2, "0")); // Months are 0-indexed
      const year = Number(date.getFullYear());

      // Combine into the desired format
      const formattedDate = `${day}-${month}-${year}`;

      const dateExpandedObj: DateExpandedObj = {
        day,
        month,
        year,
        formattedDate,
      };

      resolve(dateExpandedObj);
    } catch (error) {
      reject(error);
    }
  });
};

export const createInvoiceObjReport = async (
  jobCard: JobCard,
  invoice: Invoice
): Promise<{
  invoice: Invoice;
  partsTotal: Number;
  labourTotal: Number;
  partsSubtotal: Number;
  labourSubtotal: Number;
  partsDiscount: Number;
  labourDiscount: Number;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      let partsArr = stringToObj(jobCard.parts);
      let labourArr = stringToObj(jobCard.labour);

      let partsTotal = new Decimal(0);
      let labourTotal = new Decimal(0);

      let partsSubtotal = new Decimal(0);
      let labourSubtotal = new Decimal(0);

      let partsDiscount = new Decimal(0);
      let labourDiscount = new Decimal(0);

      let totalTax = new Decimal(0);

      let insuranceDetails;

      if (invoice.isInsuranceInvoice && invoice.invoiceType != "Quote") {
        insuranceDetails = JSON.parse(jobCard.insuranceDetails);
        //   console.log(true);
      }

      const revisedPartsArr: any = await Promise.all(
        partsArr.map(async (part: CurrentPart) => {
          const updatedPart = await processItem("Part", part, invoice);

          partsTotal = roundDecimal(
            partsTotal.add(new Decimal((updatedPart as CurrentPart).amount))
          );
          partsSubtotal = roundDecimal(
            partsSubtotal.add(
              new Decimal((updatedPart as CurrentPart).subTotal)
            )
          );
          partsDiscount = roundDecimal(
            partsDiscount.add(
              new Decimal((updatedPart as CurrentPart).discountAmt!)
            )
          );
          totalTax = roundDecimal(
            totalTax.add(new Decimal((updatedPart as CurrentPart).totalTax))
          );

          return updatedPart;
        })
      );

      const revisedLabourArr: any = await Promise.all(
        labourArr.map(async (labour: CurrentLabour) => {
          const updatedLabour = await processItem("Labour", labour, invoice);

          labourTotal = roundDecimal(
            labourTotal.add(
              new Decimal((updatedLabour as CurrentLabour).amount)
            )
          );
          labourSubtotal = roundDecimal(
            labourSubtotal.add(
              new Decimal((updatedLabour as CurrentLabour).subTotal)
            )
          );
          labourDiscount = roundDecimal(
            labourDiscount.add(
              new Decimal((updatedLabour as CurrentLabour).discountAmt!)
            )
          );
          totalTax = roundDecimal(
            totalTax.add(new Decimal((updatedLabour as CurrentLabour).totalTax))
          );

          return updatedLabour;
        })
      );

      jobCard.parts = revisedPartsArr;
      jobCard.labour = revisedLabourArr;

      jobCard.subTotal = Number(
        roundDecimal(partsSubtotal.plus(labourSubtotal))
      );
      jobCard.amount = Number(roundDecimal(partsTotal.plus(labourTotal)));

      jobCard.totalDiscountAmt = Number(
        roundDecimal(partsDiscount.plus(labourDiscount))
      );
      jobCard.totalTax = Number(totalTax);
      jobCard.placeOfSupply = "Maharashtra";
      jobCard.totalRoundedOffAmount = Math.round(
        roundToTwoDecimals(
          jobCard.subTotal - jobCard.totalDiscountAmt + jobCard.totalTax
        )
      );
      jobCard.roundOffValue = roundToTwoDecimals(
        jobCard.totalRoundedOffAmount - jobCard.amount
      );

      if (
        invoice.isInsuranceInvoice &&
        invoice.invoiceType != "Quote" &&
        invoice.insuranceInvoiceType == "Insurance"
      ) {
        jobCard.gstin = insuranceDetails.policyProviderGST;
        jobCard.customerName = insuranceDetails.policyProvider;
        jobCard.customerAddress = insuranceDetails.policyProviderAddress;
        jobCard.customerPhone = "";
      }

      const taxesSplitObj = createTaxObjNew(revisedPartsArr, revisedLabourArr);

      jobCard.taxes = taxesSplitObj;

      const dateTemp = new Date(invoice["$createdAt"]);

      const dateExpandedObj: DateExpandedObj = await createDateExpandedObj(
        dateTemp
      );

      invoice.invoiceDate = dateExpandedObj.formattedDate;

      invoice.jobCardDetails = jobCard;

      const partsTotalNum = Number(partsTotal);
      const labourTotalNum = Number(labourTotal);
      const partsSubtotalNum = Number(partsSubtotal);
      const labourSubtotalNum = Number(labourSubtotal);
      const partsDiscountNum = Number(partsDiscount);
      const labourDiscountNum = Number(labourDiscount);

      resolve({
        invoice,
        partsTotal: partsTotalNum,
        labourTotal: labourTotalNum,
        partsSubtotal: partsSubtotalNum,
        labourSubtotal: labourSubtotalNum,
        partsDiscount: partsDiscountNum,
        labourDiscount: labourDiscountNum,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export function convertToISODateTime(inputDate: string) {
  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  // Parse the input string
  const [day, monthAbbr, year, time] = inputDate.split(/[-\s]/);

  // Convert month abbreviation to numeric value
  const month = months[monthAbbr as keyof typeof months];

  // Parse time (ensure no extra offset manipulation)
  const [hours, minutes, seconds] = time.split(":").map(Number);

  // Apply your system's custom minute adjustment
  const adjustedMinutes = (minutes + 40) % 60; // Add 40, wrap around if >= 60
  const adjustedHours = (hours + Math.floor((minutes + 40) / 60)) % 24; // Adjust hours if minutes overflow

  // Construct a Date object as if the input is local time with the adjusted values
  const localDate = new Date(
    parseInt(`20${year}`), // Year
    parseInt(month) - 1, // Month (0-indexed)
    parseInt(day), // Day
    adjustedHours, // Adjusted Hours
    adjustedMinutes, // Adjusted Minutes
    seconds // Seconds remain the same
  );

  // Convert the local date to ISO format with timezone offset
  const isoString = localDate.toISOString();

  // Replace Z with +00:00 for system compatibility
  return isoString.replace("Z", "+00:00");
}

export const base64MarutiLogo =
  "data:image/png;base64,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";

export const base64Logo =
  "data:image/png;base64,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";

// Running repair
// Paid service
// Bodyshop
// General visit

export function convertToStrings<T>(array: T[]): string[] {
  return array.map((item) => JSON.stringify(item));
}

export function convertStringsToArray(array: string[] | undefined): any {
  return array?.map((item) => JSON.parse(item));
}
