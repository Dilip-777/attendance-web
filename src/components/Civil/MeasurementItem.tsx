import { Divider, Grid } from "@mui/material";
import React from "react";
import FormInput from "../FormikComponents/FormInput";
import {
  Contractor,
  Measurement,
  MeasurementItem,
  QcsBoqItem,
  Workorder,
} from "@prisma/client";
import FormSelect from "../FormikComponents/FormSelect";
import FormInput1 from "@/ui-component/FormInput";

interface MeasurementWithItems extends Measurement {
  measurementItems: MeasurementItem[];
  contractor: Contractor;
}

interface MeasurementItemProps {
  index: number;
  qcs?: boolean;
  mainIndex?: number;
  boqItems: QcsBoqItem[];
  workItem: any;
}

const AddMeasurementItem = ({
  index,
  qcs = false,
  mainIndex,
  workItem,
  boqItems,
}: MeasurementItemProps) => {
  const b = boqItems[index];

  const quantity =
    workItem?.length * workItem?.breadth * workItem?.height * workItem?.nos;

  return (
    <Grid container columnGap={8}>
      <Grid item xs={12} sm={10}>
        <FormInput
          name={
            qcs
              ? `boqs.${mainIndex}.BOQItems.${index}.description`
              : `measurementItems.${index}.description`
          }
          label="Description"
          placeHolder="Description"
          sx={{ width: "100%", maxWidth: "100%" }}
        />
      </Grid>
      {/* <Grid item xs={12} sm={5} md={4} lg={3}>
        <FormSelect
          name={`measurementItems.${index}.referenceWorkId`}
          label="References Work Id (Optional)"
          placeHolder="References Work Id (Optional)"
          sx={{ width: "100%", maxWidth: "100%" }}
          type="number"
          options={works.map((work) => ({
            value: work.id,
            label: work.description,
          }))}
        />
      </Grid> */}

      {qcs && (
        <Grid item xs={12} sm={5} md={4} lg={3}>
          <FormInput
            name={
              qcs
                ? `boqs.${mainIndex}.BOQItems.${index}.unitrate`
                : `measurementItems.${index}.unitrate`
            }
            label="Unit Rate"
            placeHolder="Unit Rate"
            sx={{ width: "100%", maxWidth: "100%" }}
            type="number"
          />
        </Grid>
      )}
      <Grid item xs={12} sm={5} md={4} lg={3}>
        <FormInput
          name={
            qcs
              ? `boqs.${mainIndex}.BOQItems.${index}.unit`
              : `measurementItems.${index}.unit`
          }
          label="Unit"
          type="text"
          placeHolder="Unit"
          sx={{ width: "100%", maxWidth: "100%" }}
        />
      </Grid>

      <Grid item xs={12} sm={5} md={4} lg={3}>
        <FormInput
          name={
            qcs
              ? `boqs.${mainIndex}.BOQItems.${index}.nos`
              : `measurementItems.${index}.nos`
          }
          label="Nos"
          type="number"
          placeHolder="Nos"
          sx={{ width: "100%", maxWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={12} sm={5} md={4} lg={3}>
        <FormInput
          name={
            qcs
              ? `boqs.${mainIndex}.BOQItems.${index}.length`
              : `measurementItems.${index}.length`
          }
          label="Length"
          type="number"
          placeHolder="Length"
          sx={{ width: "100%", maxWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={12} sm={5} md={4} lg={3}>
        <FormInput
          name={
            qcs
              ? `boqs.${mainIndex}.BOQItems.${index}.breadth`
              : `measurementItems.${index}.breadth`
          }
          label="Breadth"
          type="number"
          placeHolder="Breadth"
          sx={{ width: "100%", maxWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={12} sm={5} md={4} lg={3}>
        <FormInput
          name={
            qcs
              ? `boqs.${mainIndex}.BOQItems.${index}.height`
              : `measurementItems.${index}.height`
          }
          label="Height"
          type="number"
          placeHolder="Height"
          sx={{ width: "100%", maxWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={12} sm={5} md={4} lg={3}>
        <FormInput
          name={
            qcs
              ? `boqs.${mainIndex}.BOQItems.${index}.remarks`
              : `measurementItems.${index}.remarks`
          }
          label="Remarks"
          placeHolder="Remarks"
          sx={{ width: "100%", maxWidth: "100%" }}
        />
      </Grid>

      {/* <Grid item xs={12} sm={5} md={4} lg={3}></Grid> */}
      <Grid item xs={12} sm={5} md={4} lg={3}>
        <FormInput1
          label="Quantity"
          type="number"
          placeholder="Quantity"
          sx={{ width: "100%", maxWidth: "100%" }}
          value={quantity}
        />
      </Grid>
      <Grid item xs={12} sm={5} md={4} lg={3}>
        <FormInput1
          label="Total Quantity"
          type="number"
          placeholder="Total Quantity"
          sx={{ width: "100%", maxWidth: "100%" }}
          value={b.totalQuantity}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 3 }} />
      </Grid>
    </Grid>
  );
};

export default AddMeasurementItem;
