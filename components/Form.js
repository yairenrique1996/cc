import { useState } from "react";
import { Text, View } from "react-native";
import { styleform } from "../assets/styles/styles";
import FormButtons from "./FormButtons";
import InputRow from "./InputRow";
import Tabla from "./Tabla";
import {
  validarCampos,
  calcularDefinitiva,
  calcularObservacion,
  camposNotas,
} from "./validacion";

export default function Form() {
  const [identificacion, setIdentificacion] = useState("");
  const [nombre, setNombre] = useState("");
  const [asignatura, setAsignatura] = useState("");
  const [momentoUno, setMomentoUno] = useState("");
  const [momentoDos, setMomentoDos] = useState("");
  const [momentoTres, setMomentoTres] = useState("");
  const [definitiva, setDefinitiva] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [identificacionError, setIdentificacionError] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [asignaturaError, setAsignaturaError] = useState("");
  const [momentoUnoError, setMomentoUnoError] = useState("");
  const [momentoDosError, setMomentoDosError] = useState("");
  const [momentoTresError, setMomentoTresError] = useState("");

  const [notas, setNotas] = useState([
    {
      identificacion: "1",
      nombre: "joselito",
      asignatura: "moviles3",
      momentoUno: "4.5",
      momentoDos: "5",
      momentoTres: "4.5",
      definitiva: "4.7",
      observaciones: "Aprueba",
    }
   
  ]);

  const onPressCalcularGuardar = () => {
    // Primero validar los datos
    const isValido = validarCampos([
      { valor: identificacion, fnSetError: setIdentificacionError },
      { valor: nombre, fnSetError: setNombreError },
      { valor: asignatura, fnSetError: setAsignaturaError },
      { valor: momentoUno, fnSetError: setMomentoUnoError },
      { valor: momentoDos, fnSetError: setMomentoDosError },
      { valor: momentoTres, fnSetError: setMomentoTresError },
    ]);
    const notasValidas = camposNotas([
      { valor: momentoUno, fnSetError: setMomentoUnoError },
      { valor: momentoDos, fnSetError: setMomentoDosError },
      { valor: momentoTres, fnSetError: setMomentoTresError },
    ]);

    if (!isValido || !notasValidas) {
      return;
    }

    // Aqui ya todo esta bien validado y podemos empezar a guardar los nuevos registros
    setNotas((notasPrev) => {
      const definitiva = calcularDefinitiva(momentoUno, momentoDos, momentoTres);
      return [
        ...notasPrev,
        {
          identificacion,
          nombre,
          asignatura,
          momentoUno,
          momentoDos,
          momentoTres,
          definitiva: definitiva,
          observaciones: calcularObservacion(definitiva),
        },
      ];
    });
    onPressLimpiar();
  };

  const onPressLimpiar = () => {
    setIdentificacion("");
    setNombre("");
    setAsignatura("");
    setMomentoUno("");
    setMomentoDos("");
    setMomentoTres("");
    setDefinitiva("");
    setObservaciones("");

    setIdentificacionError("");
    setNombreError("");
    setAsignaturaError("");
    setMomentoUnoError("");
    setMomentoDosError("");
    setMomentoTresError("");
  };

  const onPressBuscar = () => {
    onPressLimpiar();
    const nota = notas.filter(
      (elemento) => elemento.identificacion === identificacion
    )[0];

    if (nota) {
      setIdentificacion(nota.identificacion);
      setNombre(nota.nombre);
      setAsignatura(nota.asignatura);
      setMomentoUno(nota.momentoUno);
      setMomentoDos(nota.momentoDos);
      setMomentoTres(nota.momentoTres);
      setDefinitiva(nota.definitiva);
      setObservaciones(nota.observaciones);
    }
  };

  return (
    <View style={styleform.container}>
      <View style={styleform.formContainer}>
        <InputRow
          label="Identificacion:"
          mensajeError={identificacionError}
          textInputProps={{
            keyboardType: "numeric",
            value: identificacion,
            onChangeText: (val) => setIdentificacion(val),
          }}
        />
        <InputRow
          label="Nombre:"
          mensajeError={nombreError}
          textInputProps={{
            value: nombre,
            onChangeText: (val) => setNombre(val),
          }}
        />
        <InputRow
          label="Asignatura:"
          mensajeError={asignaturaError}
          textInputProps={{
            value: asignatura,
            onChangeText: (val) => setAsignatura(val),
          }}
        />
        <InputRow
          label="Nota Momento 1 (30%):"
          mensajeError={momentoUnoError}
          textInputProps={{
            keyboardType: "numeric",
            value: momentoUno,
            onChangeText: (val) => setMomentoUno(val),
          }}
        />
        <InputRow
          label="Nota Momento 2 (35%):"
          mensajeError={momentoDosError}
          textInputProps={{
            keyboardType: "numeric",
            value: momentoDos,
            onChangeText: (val) => setMomentoDos(val),
          }}
        />
        <InputRow
          label="Nota Momento 3 (35%):"
          mensajeError={momentoTresError}
          textInputProps={{
            keyboardType: "numeric",
            value: momentoTres,
            onChangeText: (val) => setMomentoTres(val),
          }}
        />
        <View style={styleform.definitivaYObservaciones}>
          <Text>Definitiva:</Text>
          <Text>{definitiva}</Text>
        </View>
        <View style={styleform.definitivaYObservaciones}>
          <Text>Observaciones:</Text>
          <Text>{observaciones}</Text>
        </View>
      </View>
      <FormButtons
        onPressCalcularGuardar={onPressCalcularGuardar}
        onPressLimpiar={onPressLimpiar}
        onPressBuscar={onPressBuscar}
      />
      <Tabla notas={notas} />
    </View>
  );
}