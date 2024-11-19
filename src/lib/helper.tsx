import {
  CurrentLabour,
  CurrentPart,
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
];

export const carMakes = [
  { code: 0, description: "Hyundai" },
  { code: 1, description: "Tata" },
  { code: 2, description: "Volkswagon" },
  { code: 3, description: "BMW" },
  { code: 4, description: "Mercedes" },
];

export const purposeOfVisits = [
  { code: 0, description: "General visit" },
  { code: 1, description: "Bodyshop" },
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
    models: ["Amaze", "City", "Civic", "CR-V", "Jazz", "WR-V"],
  },
  {
    company: "Hyundai",
    models: [
      "Aura",
      "Creta",
      "Elantra",
      "Eon",
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
    ],
  },
  {
    company: "MG",
    models: ["Gloster", "Hector", "Hector Plus", "ZS", "ZSN"],
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
    company: "Tata",
    models: ["Altroz", "Harrier", "Nexon", "Nexon EV", "Tiago", "Tigor"],
  },
  {
    company: "Toyota",
    models: [
      "Camry Hybrid",
      "Fortuner",
      "Fortuner TRD",
      "Glanza",
      "Innova Crysta",
      "Innova Crysta Leadership Edition",
      "Urban Cruiser",
      "Vellfire",
      "Yaris",
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
      "Sterling Cinema Building 5th floor . 65, Murzban Street, Mumbai 01 State Maharashtra -27",
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

  console.log("TOTALS AFTER PARTS - ", subTotal, discountAmt, amount);

  labour.map((work: CurrentLabour) => {
    subTotal = roundToTwoDecimals(subTotal + work.subTotal);
    discountAmt = roundToTwoDecimals(discountAmt + (work.discountAmt || 0));
    amount = roundToTwoDecimals(amount + work.amount);
  });

  console.log("TOTALS AFTER LABOUR - ", subTotal, discountAmt, amount);

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

  insuranceAmt = roundToTwoDecimals(Number(insuranceAmt));
  customerAmt = roundToTwoDecimals(Number(customerAmt));

  return { insuranceAmt, customerAmt };
};

export const roundToTwoDecimals = (num: number) => {
  return Math.round(num * 100) / 100;
};

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

    console.log(
      "TEMP OBJECTS = " + tempCgstAmt,
      tempSgstAmt,
      tempCgstAmt + tempSgstAmt
    );

    currentPartObj.quantity = newQuantity;
    currentPartObj.subTotal = actualSubTotal;
    currentPartObj.cgstAmt = tempCgstAmt;
    currentPartObj.sgstAmt = tempSgstAmt;
    currentPartObj.totalTax = tempCgstAmt + tempSgstAmt;
    currentPartObj.amount = tempSubTotal + tempCgstAmt + tempSgstAmt;

    return currentPartObj;
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

export const createTaxObj = (parts: CurrentPart[], labour: CurrentLabour[]) => {
  let taxes: TaxObj[] = [];

  parts.map((part: CurrentPart) => {
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

      taxes.push(sgstObj);
    }
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

      taxes.push(cgstObj);
    }

    if (foundSgstObjIndex != -1) {
      let arrayFirstHalf = taxes!.slice(0, foundSgstObjIndex);
      let arraySecondHalf = taxes!.slice(foundSgstObjIndex + 1);

      taxes[foundSgstObjIndex].taxAmt = roundToTwoDecimals(
        taxes[foundSgstObjIndex].taxAmt + work.sgstAmt
      );

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
