import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import DatePicker from "react-native-date-picker";
import Constants from "../../util/Constants";

const normalizeDate = (dob) => {
  if (!dob) return new Date();
  if (dob instanceof Date) return dob;

  const parts = dob.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return new Date(year, month - 1, day);
  }
  return new Date();
};

const CustomDatePicker = ({ dob, setDob, visible, setVisible }) => {
  const [date, setDate] = useState(normalizeDate(dob));

  useEffect(() => {
    if (visible) {
      setDate(normalizeDate(dob));
    }
  }, [visible, dob]);

  const handleCancel = () => {
    setVisible(false);
  };

  const formatDateToMMDDYYYY = (dateValue) => {
    const date = new Date(dateValue);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleConfirm = () => {
    setDob(formatDateToMMDDYYYY(date));
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <DatePicker
            date={date}
            onDateChange={(newDate) => {
              setDate(newDate);
            }}
            mode="date"
            maximumDate={new Date()}
            theme="light"
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: Constants.COLOR.THEME_COLOR,
    padding: 10,
    borderRadius: 8,
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "50%",
    marginTop: 20,
  },
});

export default CustomDatePicker;
