import { lazy } from "react";

const WIDGET_MAP = {
  trig_circle: lazy(
    () => import("@/components/animaions/InteractiveUnitCircle"),
  ),
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
  vectorInnerProject: lazy(
    () => import("@/components/animaions/VectorInnerProductWidget"),
  ),
  derivative: lazy(
    () => import("@/components/animaions/DerivativeWidget"), // 프론트엔드의 실제 파일 경로에 맞게 수정해주세요
  ),
};

export default WIDGET_MAP;
