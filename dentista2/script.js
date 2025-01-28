document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }
    });
    calendar.render();

    const form = document.getElementById('treatmentForm');
    const totalDuration = document.getElementById('totalDuration');
    const endDate = document.getElementById('endDate');
    const treatmentDates = document.getElementById('treatmentDates');
    const printButton = document.getElementById('printButton');
    const results = document.getElementById('results');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const numTreatments = parseInt(document.getElementById('numTreatments').value);
        const daysPerTreatment = parseInt(document.getElementById('daysPerTreatment').value);
        const startDate = new Date(document.getElementById('startDate').value);

        const totalDays = numTreatments * daysPerTreatment;
        const endDateValue = new Date(startDate);
        endDateValue.setDate(startDate.getDate() + totalDays);

        const events = [];
        const treatmentDatesList = [];
        for (let i = 0; i < numTreatments; i++) {
            const treatmentStartDate = new Date(startDate);
            treatmentStartDate.setDate(startDate.getDate() + (i * daysPerTreatment));
            events.push({
                title: `Cambio ${i + 1}`,
                start: treatmentStartDate.toISOString().split('T')[0],
                allDay: true,
                color: '#007bff'
            });
            treatmentDatesList.push(treatmentStartDate.toLocaleDateString('es-ES'));
        }

        events.push({
            title: 'Duración total',
            start: startDate.toISOString().split('T')[0],
            end: endDateValue.toISOString().split('T')[0],
            allDay: true,
            color: '#28a745'
        });

        calendar.removeAllEvents();
        calendar.addEventSource(events);

        // Mover el calendario al día de inicio del tratamiento
        calendar.gotoDate(startDate);

        // Mostrar resultados en texto
        totalDuration.textContent = `${totalDays} días`;
        endDate.textContent = endDateValue.toLocaleDateString('es-ES');
        treatmentDates.innerHTML = treatmentDatesList.map(date => `<li>${date}</li>`).join('');
        results.classList.remove("hidden");
    });

    printButton.addEventListener('click', function() {
        const printableContent = `
            <div id="printableTreatment">
                <h2>Resumen del programa</h2>
                <p><strong>Duración total:</strong> ${totalDuration.textContent}</p>
                <p><strong>Fecha de finalización:</strong> ${endDate.textContent}</p>
                <h3>Fechas de cambio de corrector:</h3>
                <ul>${treatmentDates.innerHTML}</ul>
            </div>
        `;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Programa</title>');
        printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printableContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    });
});