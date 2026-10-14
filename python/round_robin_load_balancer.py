# ​Challenge: Round-Robin Load Balancer with Health Checks
# ​Whether you are managing a global fleet of AWS instances or deploying lightweight edge 
# services on a homelab, robust request routing is non-negotiable. An L7 load balancer 
# distributes incoming requests across a pool of upstream servers. Implement a basic 
# software load balancer using a round-robin algorithm that dynamically respects 
# server health states.

import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class LoadBalancer:
    def __init__(self, custom_logger: logging.Logger | None = None):
        self.healthy_count: int = 0
        self.last_selected_idx: int = -1
        self.logger: custom_logger or logging.getLogger(__name__)
        self.server_health: dict[str, bool] = {}
        self.server_pool: list[str] = []

    def add_server(self, server_id: str) -> None:
        if server_id not in self.server_health:
            self.server_pool.append(server_id)
            self.server_health[server_id] = True
            self.healthy_count += 1
        else:
            logger.warning("Server %s already exists in the pool.", server_id)

    def remove_server(self, server_id: str) -> None:
        if server_id in self.server_health:
            self.server_pool.remove(server_id)
            if self.server_health[server_id]:
                self.healthy_count -= 1
            del self.server_health[server_id]
        else:
            logger.error("Server ID %s is not in current server pool.", server_id)

    def update_status(self, server_id: str, is_healthy: bool) -> None:
        if server_id in self.server_health:
            if self.server_health[server_id] != is_healthy:
                self.server_health[server_id] = is_healthy
                self.healthy_count += 1 if is_healthy else -1
        else:
            logger.error("Server ID %s is not in current server pool.", server_id)

    def get_next_server(self) -> str:
        if self.healthy_count == 0:
            raise RuntimeError("There are currently no healthy servers.")

        pool_size = len(self.server_pool)
        
        # Unbounded loop is computationally safe because healthy_count > 0 guarantees a return
        while True:
            self.last_selected_idx = (self.last_selected_idx + 1) % pool_size
            candidate = self.server_pool[self.last_selected_idx]
            
            if self.server_health[candidate]:
                return candidate
