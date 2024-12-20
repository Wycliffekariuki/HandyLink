import React from "react";
import { View, Text, ScrollView, StyleSheet,Button ,TextInput} from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";


const Table = ({ tableData }) => {
  // Ensure tableData is a non-empty array
  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <Text>No data available</Text>;
  }

  // Get the column headers from the first row (assumes that each row has the same structure)
  const headers = Object.keys(tableData[0]);
/*
  const tableData = [
    { Name: "John Doe", Age: 28, Occupation: "Engineer" },
    { Name: "Jane Smith", Age: 32, Occupation: "Doctor" },
    { Name: "Mike Johnson", Age: 45, Occupation: "Teacher" },
  ]; */

  // Generate HTML table rows dynamically
        const generateHTML = (tableData) => {
          const headers = Object.keys(tableData[0]);

          const headerRow = `
    <tr>
      ${headers.map((header) => `<th style="border: 1px solid black;">${header}</th>`).join("")}
    </tr>
  `;

          const rows = tableData
            .map(
              (row) => `
        <tr>
          ${headers.map((header) => `<td style="border: 1px solid black;">${row[header]}</td>`).join("")}
        </tr>
      `,
            )
            .join("");

          return `
    <html>
      <body>
        <table style="width: 100%; border-collapse: collapse;">
          ${headerRow}
          ${rows}
        </table>
      </body>
    </html>
  `;
        };





 const generatePDF = async () => {
   try {
     
    const htmlContent = generateHTML(tableData);

    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    console.log("PDF generated at:", uri);

    // Share the file using the native sharing options
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert("Sharing is not available on this device.");
    }

   } catch (error) {
     console.error("Error generating PDF:", error);
   }
 };


  
  return (
    <ScrollView horizontal={true} vertical={true} style={styles.container}>
      <View>
        {/* Table Header */}
        <View style={styles.row}>
          {headers.map((header, index) => (
            <View key={`header-${index}`} style={[styles.cell, styles.headerCell]}>
              <Text style={styles.headerText}>{header}</Text>
            </View>
          ))}
        </View>

        {/* Table Rows */}
        <ScrollView style={styles.rowsContainer} nestedScrollEnabled={true}>
          {tableData.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {headers.map((header, cellIndex) => (
                <View key={`cell-${rowIndex}-${cellIndex}`} style={styles.cell}>
                  <Text style={styles.dataText}>{row[header]}</Text>
                  <TextInput />
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
        <Button title="Save as PDF" onPress={generatePDF} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    width: 280, // Ensures each column is at least 200 pixels wide
    
    justifyContent: "center",
    alignItems: "center",
  },
  headerCell: {
    backgroundColor: "#f4f4f4", // Header background color
    borderTopWidth: 2, // Thicker border on top of the header
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  dataText: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
});

export default Table;
