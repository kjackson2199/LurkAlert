import React, { useEffect, useState } from "react";
import "./systemStatusViewer.css";

interface Status{
    uptime_string: string;
    memory_used: number;
    memory_total: number;
    memory_percent: number;
    cpu_temp: number;
    free_disk_space: number;
    total_disk_space: number;
    percent_disk_space_used: number;
}

const SystemStatusViewer: React.FC = () => {
    const [status, setStatus] = useState<Status | null>(null);

    useEffect(() => {
        fetchSystemStatus();
    }, []);

    const fetchSystemStatus = async () => {
        try {
            const response = await fetch("http://100.100.111.72:5333/system_status");
            if (!response.ok) { 
                throw new Error("Network response was not ok");
            }
            console.log("Response:", response);
            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Fetched data:", data.system_status);
            setStatus(data.system_status);
        
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
                        <th>Free Disk Space</th>
                        <th>Disk Space Total</th>
                        <th>Disk Space Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{status?.uptime_string != null ? status.uptime_string : "---"}</td>
                        <td>{status?.memory_used != null ? status.memory_used : "---"}</td>
                        <td>{status?.memory_total != null ? status.memory_total : "---"}</td>
                        <td>{status?.memory_percent != null ? status.memory_percent : "--"}%</td>
                        <td>{status?.cpu_temp != null ? status.cpu_temp : "--"}°C</td>
                        <td>{status?.free_disk_space != null ? status.free_disk_space : "---"}</td>
                        <td>{status?.total_disk_space != null ? status.total_disk_space : "---"}</td>
                        <td>{status?.percent_disk_space_used != null ? status.percent_disk_space_used : "--"}%</td>
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