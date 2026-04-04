import { lazy } from "react";

const WIDGET_MAP = {
  trig_circle: null,
  // lazy(
  //   () => import("@/components/animaions/InteractiveUnitCircle"),
  // )
  ohms_law: lazy(
    () => import("@/components/animaions/ParallelResistanceWidget"),
  ),
  y_delta_converter: lazy(
    () => import("@/components/animaions/YDeltaConverterWidget"),
  ),
  coulombs_law: lazy(() => import("@/components/animaions/CoulombsLaw3DPage")),
  rotating_field: lazy(
    () => import("@/components/animaions/RotatingMagneticFieldWidget"),
  ),
  dc_rectifier: lazy(
    () => import("@/components/animaions/DcRectificationWidget"),
  ),
  equipotential: lazy(
    () => import("@/components/animaions/Equipotential3DWidget"),
  ),
  ampere_law: lazy(() => import("@/components/animaions/AmpereLawWidget")),
  parabolaWidget: lazy(
    () => import("@/components/animaions/ParabolaIntersection"),
  ),
  vectorInnerProject: null,
  // lazy(
  //   () => import("@/components/animaions/VectorInnerProductWidget"),
  // )
};

export default WIDGET_MAP;
