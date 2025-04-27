import psutil
import time

class SystemStatus:
    def __init__(self):
        self._uptime_str = ""
        self._uptime_seconds = 0
        self._recording_time_elapsed = 0
        self._boot_time = 0
        self.cpu_usage = 0
        self.memory_used = 0
        self.memory_total = 0
        self.memory_percent = 0
        self.cpu_temp_c = 0
        self.free_disk_space = 0
        self.percent_disk_space_used = 0
        self.total_disk_space = 0

        self.update()
    
    def get_status_object(self):
        self.update()
        obj = {}
        obj['uptime_string'] = self._uptime_str
        obj['uptime_seconds'] = self._uptime_seconds
        obj['recording_time_elapsed'] = self._recording_time_elapsed
        
        obj['memory_used'] = self.memory_used
        obj['memory_total'] = self.memory_total
        obj['memory_percent'] = self.memory_percent

        obj['cpu_temp'] = self.cpu_temp_c

        obj['free_disk_space'] = self.free_disk_space
        obj['percent_disk_space_used'] = self.percent_disk_space_used
        obj['total_disk_space'] = self.total_disk_space

        return {'system_status': obj}
    
    def update(self):
        boot_time = psutil.boot_time()
        self._boot_time = boot_time

        uptime_seconds = int(time.time() - boot_time)
        hours = uptime_seconds // 3600
        minutes = (uptime_seconds % 3600) // 60
        seconds = uptime_seconds % 60

        self._uptime_str = f"{hours:02}:{minutes:02}:{seconds:02}"

        # CPU and Memory
        cpu_usage = psutil.cpu_percent(interval=0.5)
        memory = psutil.virtual_memory()
        memory_used_mb = memory.used // (1024 * 1024)
        memory_total_mb = memory.total // (1024 * 1024)
        memory_percent = memory.percent

        try:
            temps = psutil.sensors_tempuratures()
            cpu_temp = temps["cpu_thermal"][0].current if "cpu_thermal" in temps else None
        except Exception:
            cpu_temp = None
        
        disk_usage = psutil.disk_usage('/')

        self.free_disk_space = round(disk_usage.free / (1024**3), 2)
        self.total_disk_space = round(disk_usage.total / (1024**3), 2)
        self.percent_disk_space_used = disk_usage.percent
        
        self.cpu_usage = cpu_usage
        self.memory_used = memory_used_mb
        self.memory_total = memory_total_mb
        self.memory_percent = memory_percent
        self.cpu_temp_c = round(cpu_temp, 1)
        
        