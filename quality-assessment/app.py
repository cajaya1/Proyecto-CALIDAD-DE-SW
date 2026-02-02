import streamlit as st
import pandas as pd
from datetime import datetime

# Configuración de la página
st.set_page_config(page_title="CICS - Histórico de Calidad", layout="wide")

# --- INICIALIZAR HISTÓRICO (SESSION STATE) ---
if 'historico' not in st.session_state:
    st.session_state.historico = []

# --- LÓGICA DE ESTADOS ---
def interpretar_estado(valor, umbral_ok, tipo="mayor_es_mejor"):
    if tipo == "mayor_es_mejor":
        if valor >= umbral_ok: return "success", "ÓPTIMO"
        elif valor >= (umbral_ok * 0.8): return "warning", "RIESGO"
        else: return "error", "CRÍTICO"
    else: # menor_es_mejor
        if valor <= umbral_ok: return "success", "ÓPTIMO"
        elif valor <= (umbral_ok * 1.5): return "warning", "RIESGO"
        else: return "error", "CRÍTICO"

# --- INTERFAZ GRÁFICA ---
st.title("📈 Calculadora CICS con Histórico de Evolución")
st.markdown("Evaluación dinámica de ISO 29110, 9001 y 25010 con seguimiento de versiones.")

# --- BARRA LATERAL (CONFIGURACIÓN Y GUARDADO) ---
with st.sidebar:
    st.header("Gestión de Versiones")
    nombre_proyecto = st.text_input("Nombre del Proyecto / Versión", "Versión 1.0")
    st.info("Modifica los valores en las pestañas y luego guarda el estado actual aquí:")
    
    # Botón para guardar el estado actual en el histórico
    guardar = st.button("📸 Guardar Snapshot en Histórico")

# TABS PRINCIPALES
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "1. Procesos", 
    "2. Producto Técnico", 
    "3. Experiencia Uso", 
    "4. REPORTE FINAL",
    "5. 📊 GRÁFICAS HISTÓRICAS"
])

# --- PESTAÑA 1: PROCESOS ---
with tab1:
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("ISO 29110 (ICP)")
        act_plan = st.number_input("Actividades Planificadas", 1, 15)
        act_real = st.number_input("Actividades Realizadas", 0, 13)
        icp = (act_real / act_plan) * 100
        color_icp, estado_icp = interpretar_estado(icp, 85, "mayor_es_mejor")
        st.metric("ICP (Cumplimiento)", f"{icp:.1f}%", delta=estado_icp)

    with col2:
        st.subheader("ISO 9001 (NC)")
        proc_audit = st.number_input("Procesos Auditados", 1, 4)
        no_conf = st.number_input("No Conformidades", 0, 1)
        nc = (no_conf / proc_audit) * 100
        if nc == 0: color_nc, estado_nc = "success", "LIMPIO"
        else: color_nc, estado_nc = "error", "DETECTADO"
        st.metric("NC (No Conformidad)", f"{nc:.1f}%", delta=estado_nc, delta_color="inverse")

# --- PESTAÑA 2: PRODUCTO ---
with tab2:
    c1, c2 = st.columns(2)
    with c1:
        st.markdown("### Fiabilidad (MTBF)")
        horas = st.number_input("Horas Operación", value=168)
        fallos = st.number_input("N° Fallos", value=8)
        mtbf = horas / fallos if fallos > 0 else horas
        
        if mtbf <= 24: estado_mtbf = "CRÍTICO"
        elif mtbf <= 72: estado_mtbf = "ALERTA"
        else: estado_mtbf = "ESTABLE"
        st.metric("MTBF (Horas)", f"{mtbf:.1f} h", estado_mtbf)

    with c2:
        st.markdown("### Rendimiento (TPR)")
        ms_total = st.number_input("Suma Tiempos (ms)", value=5400)
        reqs = st.number_input("Solicitudes", value=300)
        tpr = ms_total / reqs if reqs > 0 else 0
        
        if tpr <= 200: estado_tpr = "EXCELENTE"
        elif tpr <= 1000: estado_tpr = "ACEPTABLE"
        else: estado_tpr = "LENTO"
        st.metric("TPR (Promedio)", f"{tpr:.1f} ms", estado_tpr, delta_color="inverse")
    
    st.divider()
    c3, c4 = st.columns(2)
    with c3:
        st.markdown("### Seguridad (IVC)")
        v_tot = st.number_input("Vuln. Totales", value=14)
        v_crit = st.number_input("Vuln. Críticas", value=2)
        ivc = (v_crit / v_tot) * 100 if v_tot > 0 else 0
        estado_ivc = "ALERTA" if ivc > 0 else "SEGURO"
        st.metric("IVC (Vuln. Crítica)", f"{ivc:.1f}%", estado_ivc, delta_color="inverse")

    with c4:
        st.markdown("### Mantenibilidad (CC)")
        E = st.number_input("Aristas (E)", value=25)
        N = st.number_input("Nodos (N)", value=20)
        P = st.number_input("Componentes (P)", value=1)
        cc = E - N + (2 * P)
        if cc <= 10: estado_cc = "SIMPLE"
        elif cc <= 20: estado_cc = "MODERADO"
        else: estado_cc = "COMPLEJO"
        st.metric("Complejidad", cc, estado_cc, delta_color="inverse")

# --- PESTAÑA 3: USO ---
with tab3:
    st.markdown("### Usabilidad (Tasa Éxito)")
    t_tot = st.number_input("Tareas Totales", value=40)
    t_ok = st.number_input("Tareas OK", value=35)
    tasa_exito = (t_ok / t_tot) * 100 if t_tot > 0 else 0
    estado_uso = "ALTA" if tasa_exito > 80 else "BAJA"
    st.metric("Tasa de Éxito", f"{tasa_exito:.1f}%", estado_uso)

# --- LÓGICA DE GUARDADO DE HISTÓRICO ---
if guardar:
    snapshot = {
        "Versión": nombre_proyecto,
        "Hora": datetime.now().strftime("%H:%M:%S"),
        "ICP (%)": icp,
        "NC (%)": nc,
        "MTBF (h)": mtbf,
        "TPR (ms)": tpr,
        "IVC (%)": ivc,
        "Complejidad": cc,
        "Usabilidad (%)": tasa_exito
    }
    st.session_state.historico.append(snapshot)
    st.success(f"✅ Snapshot '{nombre_proyecto}' guardado exitosamente.")

# --- PESTAÑA 4: REPORTE FINAL ---
with tab4:
    st.header(f"Resultados Actuales: {nombre_proyecto}")
    
    # 1. Creamos la data con VALOR y ESTADO
    datos_reporte = [
        {"Métrica": "Procesos (ICP)", "Valor Real": f"{icp:.1f}%", "Estado": estado_icp},
        {"Métrica": "Auditoría (NC)", "Valor Real": f"{nc:.1f}%", "Estado": estado_nc},
        {"Métrica": "Fiabilidad (MTBF)", "Valor Real": f"{mtbf:.1f} h", "Estado": estado_mtbf},
        {"Métrica": "Rendimiento (TPR)", "Valor Real": f"{tpr:.1f} ms", "Estado": estado_tpr},
        {"Métrica": "Seguridad (IVC)", "Valor Real": f"{ivc:.1f}%", "Estado": estado_ivc},
        {"Métrica": "Complejidad (CC)", "Valor Real": f"{cc}", "Estado": estado_cc},
        {"Métrica": "Usabilidad", "Valor Real": f"{tasa_exito:.1f}%", "Estado": estado_uso},
    ]
    
    df_resumen = pd.DataFrame(datos_reporte)

    # 2. Función para colorear filas según estado
    def color_coding(row):
        malos = ["RIESGO", "CRÍTICO", "DETECTADO", "ALERTA", "LENTO", "COMPLEJO", "BAJA"]
        if row["Estado"] in malos:
            return ['background-color: #ffcccc; color: black'] * len(row)
        return ['background-color: #ccffcc; color: black'] * len(row)

    st.table(df_resumen.style.apply(color_coding, axis=1))

# --- PESTAÑA 5: HISTÓRICO Y GRÁFICAS ---
with tab5:
    st.header("📊 Evolución del Proyecto")
    
    if len(st.session_state.historico) > 0:
        # Convertir lista de dicts a DataFrame
        df_hist = pd.DataFrame(st.session_state.historico)
        
        # Mostrar tabla de datos brutos
        st.write("Registro de Cambios:")
        st.dataframe(df_hist)
        
        st.divider()
        
        # GRÁFICA COMPARATIVA
        st.subheader("Comparativa Visual (Métricas en %)")
        # Filtramos solo las métricas que son porcentajes para que la gráfica tenga sentido
        metrics_pct = ["ICP (%)", "NC (%)", "IVC (%)", "Usabilidad (%)"]
        
        if len(df_hist) > 0:
            # Usamos el nombre de la versión como índice para el eje X
            chart_data = df_hist.set_index("Versión")[metrics_pct]
            st.line_chart(chart_data)
            st.caption("Nota: Se grafican solo las métricas basadas en porcentaje (0-100) para mantener la escala visual.")
            
            # Gráfica separada para Rendimiento (Escalas diferentes)
            col_h1, col_h2 = st.columns(2)
            with col_h1:
                st.subheader("Evolución Rendimiento (ms)")
                st.bar_chart(df_hist.set_index("Versión")["TPR (ms)"])
            with col_h2:
                st.subheader("Evolución Fiabilidad (h)")
                st.bar_chart(df_hist.set_index("Versión")["MTBF (h)"])
            
    else:
        st.info("Aún no hay datos en el histórico. Ajusta valores en las pestañas y presiona 'Guardar Snapshot' en la barra lateral.")
