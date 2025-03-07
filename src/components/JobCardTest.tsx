import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { CurrentLabour, CurrentPart } from "@/lib/definitions";
import { roundToTwoDecimals, stringToObj } from "@/lib/helper";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});

// Stylesheet for react-pdf
const styles = StyleSheet.create({
  page: {
    display: "flex",
    padding: "20px",
    marginTop: "20px",
  },
  headingRow: {
    width: "100%",
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontFamily: "Open Sans",
    fontWeight: "black",
    textAlign: "center",
  },
  addressRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 30,
  },
  Maruti_Logo: {
    width: 100,
    height: 100,
  },
  addressBlock: {
    display: "flex",
    flexDirection: "column",
    width: "40%",
  },
  workShopName: {
    fontSize: 12,
    fontFamily: "Open Sans",
    fontWeight: "black",
    alignSelf: "flex-end",
  },
  workShopAddress: {
    fontSize: 12,
    fontFamily: "Open Sans",
    fontWeight: "thin",
    alignSelf: "flex-end",
  },
  workShopGST: {
    fontSize: 12,
    fontFamily: "Open Sans",
    fontWeight: "black",
    alignSelf: "flex-end",
  },
  invoiceTypeRow: {
    width: "100%",
    marginBottom: 10,
  },
  invoiceType: {
    fontSize: 14,
    fontFamily: "Open Sans",
    fontWeight: "black",
    textAlign: "center",
  },
  detailTablesRow: {
    width: "100%",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  detailTable: {
    width: 180,
    height: "auto",
    // backgroundColor: "#E11D48",
    borderWidth: 1.5,
    borderColor: "#000000",
  },
  tableTitleRow: {
    width: "100%",
    backgroundColor: "#D1D5DB",
    textAlign: "center",
  },
  tableTitle: {
    fontSize: 11,
    fontFamily: "Open Sans",
    fontWeight: "black",
    padding: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: "#000000",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  tableCell: {
    borderWidth: 0.5,
    borderColor: "#000000",
    width: "50%",
  },
  tableData: {
    fontSize: 11,
    padding: 5,
  },
  tableDataEmphasized: {
    fontFamily: "Open Sans",
    fontWeight: "black",
  },
  partsTable: {
    width: "100%",
    height: "auto",
    borderWidth: 1.5,
    borderColor: "#000000",
    marginBottom: 20,
  },
  tableHeaderRow: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#D1D5DB",
    width: "100%",
    justifyContent: "space-evenly",
  },
  tableHeader: {
    borderWidth: 0.5,
    borderColor: "#000000",
    width: "100%",
    textAlign: "center",
    fontSize: 8,
  },
  tableFooterRow: {
    backgroundColor: "#D1D5DB",
  },
  tableEmptyCell: {
    width: "50%",
  },
  footerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  observationTable: {
    width: "40%",
    height: "auto",
    // backgroundColor: "#E11D48",
    borderWidth: 1.5,
    borderColor: "#000000",
  },
  observationRow: {},
  totalsTable: {
    width: "50%",
    height: "auto",
    // backgroundColor: "#E11D48",
    borderWidth: 1.5,
    borderColor: "#000000",
  },
  totalsTableRow: {
    display: "flex",
    flexDirection: "row",
  },
  totalsTableHeadingCell: {
    width: "60%",
    backgroundColor: "#D1D5DB",
    borderWidth: 0.5,
    borderColor: "#000000",
  },
  gatePassHeading: {
    fontSize: 24,
  },
  gatePassDate: {
    marginBottom: 30,
  },
  logoView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  imageHeading: {
    fontSize: 12,
  },
  imageArr: {
    display: "flex",
  },
  carImages: {
    width: "auto",
    height: "auto",
  },
  diagnosisTable: {
    width: "auto",
    height: "auto",
    // backgroundColor: "#E11D48",
    borderWidth: 1.5,
    borderColor: "#000000",
  },
});

export const JobCardPDF = ({
  jobCard,
  logo,
  marutiLogo,
  car,
  invoiceType,
}: any) => {
  const imagesArr = stringToObj(jobCard.images);
  // const diagnosisStrings = stringToObj(jobCard.diagnosis);
  // jobCard.images = stringToObj(jobCard.images);
  console.log(jobCard.imagesArr);

  return (
    <Document>
      {jobCard && car && (
        <Page size="A4" style={styles.page}>
          <View style={styles.addressRow}>
            <View style={styles.logoView}>
              <Image
                style={styles.Maruti_Logo}
                src={marutiLogo}
                alt-text={".."}
              />
              <Image style={styles.logo} src={logo} alt-text={".."} />
            </View>
            <View style={styles.addressBlock}>
              <Text style={styles.workShopName}>CHAMUNDA MOTORS PVT. LTD.</Text>
              <Text style={styles.workShopAddress}>
                21/1-1, RAM BAUGH, OFF S V ROAD, <br />
                BORIVALI WEST, MUMBAI SUBURBAN
              </Text>
              <Text style={styles.workShopGST}>GST NO: 27AAACC1903H1Z4</Text>
            </View>
          </View>
          <View style={styles.invoiceTypeRow}>
            <Text style={[styles.invoiceType, styles.gatePassHeading]}>
              {invoiceType}
            </Text>
          </View>
          <View style={styles.detailTablesRow}>
            <View style={styles.detailTable}>
              <View style={styles.tableTitleRow}>
                <Text style={styles.tableTitle}>Customer Details</Text>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                    Name:
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableData}>{jobCard.customerName}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                    Mobile:
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableData}>
                    {" "}
                    {jobCard?.customerPhone}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                    Address:
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableData}>
                    {" "}
                    {jobCard?.customerAddress}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.detailTable}>
              <View style={styles.tableTitleRow}>
                <Text style={styles.tableTitle}>Vehicle Details</Text>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                    Registration:
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableData}> {jobCard?.carNumber}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                    Make:
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableData}> {car?.carMake}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                    Model:
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableData}>{car?.carModel}</Text>
                </View>
              </View>
            </View>
            <View style={styles.detailTable}>
              <View style={styles.tableTitleRow}>
                <Text style={styles.tableTitle}>Invoice Details</Text>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                    Job Card No:
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableData}>{jobCard.jobCardNumber}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                    Service Type:
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableData}>{jobCard.purposeOfVisit}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.footerRow}>
            <View style={styles.observationTable}>
              <View style={styles.tableTitleRow}>
                <Text style={styles.tableTitle}>Car Images</Text>
              </View>
              <View style={styles.imageArr}>
                {imagesArr.map((a, index) => (
                  <View key={index}>
                    <Text style={styles.imageHeading}>{a.imageType}</Text>
                    {a.thumbnailURL && (
                      <Image
                        style={styles.carImages}
                        src={a.thumbnailURL}
                        alt-text={".."}
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.observationTable}>
              <View style={styles.tableTitleRow}>
                <Text style={styles.tableTitle}>Diagnosis</Text>
              </View>
              <View style={styles.observationRow}>
                <View style={styles.diagnosisTable}>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <Text
                        style={[styles.tableData, styles.tableDataEmphasized]}
                      >
                        Car Odometer
                      </Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.tableData}>
                        {jobCard.carOdometer}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <Text
                        style={[styles.tableData, styles.tableDataEmphasized]}
                      >
                        Car Fuel
                      </Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.tableData}>{jobCard.carFuel}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <Text
                        style={[styles.tableData, styles.tableDataEmphasized]}
                      >
                        Diagnosis
                      </Text>
                    </View>
                    <View style={styles.tableCell}>
                      <ul>
                        {jobCard.diagnosis.map((a: any, index: number) => (
                          <li key={index}>
                            <Text style={styles.tableData}>{`. ${a}`}</Text>
                          </li>
                        ))}
                      </ul>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Page>
      )}
    </Document>
  );
};
