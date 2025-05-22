import { jsPDF } from "jspdf";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

// Generate a unique invoice number
const generateInvoiceNumber = async () => {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000);
  const invoiceNumber = `${timestamp}-${randomNumber}`;

  // Firestore reference
  const firestore = firebase.firestore();
  const invoiceRef = firestore.collection("invoices").doc(invoiceNumber);

  // Check if the invoice number already exists
  const doc = await invoiceRef.get();
  if (doc.exists) {
    // If the invoice number exists, recursively generate a new one
    return await generateInvoiceNumber();
  }

  // Store the invoice number in Firestore
  await invoiceRef.set({ timestamp });
  
  return invoiceNumber;
};

// Generate and upload the receipt
const generateReceipt = async (paymentDetails) => {
  try {
    const invoiceNumber = await generateInvoiceNumber();

    // Firebase storage reference
    const storage = firebase.storage();
    const storageRef = storage.ref();
    
    // Generate the PDF receipt
    const receiptBlob = await generateReceiptPDF(paymentDetails);
    
    // Upload the receipt to Firebase Storage
    const receiptRef = storageRef.child(`receipts/${invoiceNumber}.pdf`);
    await receiptRef.put(receiptBlob);

    // Get the download URL of the uploaded receipt
    const receiptURL = await receiptRef.getDownloadURL();

    // Return the invoice number and receipt URL
    return { invoiceNumber, receiptURL };
  } catch (error) {
    console.error("Error generating receipt:", error);
    throw error;
  }
};

// Generate the PDF receipt
const generateReceiptPDF = async (paymentDetails) => {
  const doc = new jsPDF();
  doc.text("Invoice Number: " + paymentDetails.invoiceNumber, 10, 10);
  doc.text("Payment Amount: " + paymentDetails.amount, 10, 20);
  // Add other payment details to the PDF

  return doc.output("blob");
};

export default generateReceipt;
