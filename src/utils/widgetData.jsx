import AmpereLawWidget from "@/components/animaions/AmpereLawWidget";
import CoulombsLaw3DPage from "@/components/animaions/CoulombsLaw3DPage";
import DcRectificationWidget from "@/components/animaions/DcRectificationWidget";
import Equipotential3DWidget from "@/components/animaions/Equipotential3DWidget";
import InteractiveUnitCircle from "@/components/animaions/InteractiveUnitCircle";
import ParabolaIntersection from "@/components/animaions/ParabolaIntersection";
import ParallelResistanceWidget from "@/components/animaions/ParallelResistanceWidget";
import RotatingMagneticFieldWidget from "@/components/animaions/RotatingMagneticFieldWidget";
import VectorInnerProductWidget from "@/components/animaions/VectorInnerProductWidget";
import YDeltaConverterWidget from "@/components/animaions/YDeltaConverterWidget";

const WIDGET_MAP = {
  trig_circle: InteractiveUnitCircle, // 예: InteractiveUnitCircle
  ohms_law: ParallelResistanceWidget, // 👈 null 대신 추가!
  y_delta_converter: YDeltaConverterWidget, // 👈 null 대신 추가!
  coulombs_law: CoulombsLaw3DPage,
  rotating_field: RotatingMagneticFieldWidget, // 회전자기장 (기기)
  dc_rectifier: DcRectificationWidget, // DC 정류 (기기)
  equipotential: Equipotential3DWidget, // 등전위면 (전자기)
  ampere_law: AmpereLawWidget, // 앙페르/솔레노이드 (전자기)
  parabolaWidget: ParabolaIntersection,
  vectorInnerProject: VectorInnerProductWidget,
};
export default WIDGET_MAP;
