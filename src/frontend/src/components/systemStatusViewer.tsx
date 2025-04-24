import React, { useEffect, useState } from "react";
import "./systemStatusViewer.css";

interface Status{
    uptime: string;
    memoryUsed: number;
    memoryTotal: number;
    memoryPercentage: number;
    cpuTemp: number;
}

const SystemStatusViewer: React.FC = () => {
    const [status, setStatus] = useState<Status | null>(null);

    useEffect(() => {
        fetchSystemStatus();
    }, []);

    async function fetchSystemStatus() {
        try {
            const response = await fetch("http://100.100.111.72:5333/system_status");
            if (!response.ok) { 
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setStatus(data);
        
        } catch (error) {
            console.error("Error fetching system status:", error);
            setStatus(null);
        }
    }

    return (
        <div>
            <table className="system-status-table">
                <caption>System Status</caption>
                <thead>
                    <tr>
                        <th>Uptime</th>
                        <th>Memory Used</th>
                        <th>Memory Total</th>
                        <th>Memory Percentage</th>
                        <th>CPU Temp</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{status?.uptime != null ? status.uptime : "---"}</td>
                        <td>{status?.memoryUsed != null ? status.memoryUsed : "---"}</td>
                        <td>{status?.memoryTotal != null ? status.memoryTotal : "---"}</td>
                        <td>{status?.memoryPercentage != null ? status.memoryPercentage : "--"}%</td>
                        <td>{status?.cpuTemp != null ? status.cpuTemp : "--"}°C</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5}>
                            <button className="refresh-button" onClick={fetchSystemStatus}>Refresh</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default SystemStatusViewer;