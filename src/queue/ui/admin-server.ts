import fastify from 'fastify';
import { Queue } from 'bullmq';
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { FastifyAdapter } from "@bull-board/fastify";
import type { BaseAdapter } from "@bull-board/api/dist/src/queueAdapters/base";
import cluster from "cluster";


const serverAdapter = new FastifyAdapter().setBasePath("/ui");

class QManagerForAdminUI {
    private static instance: QManagerForAdminUI;
    qList: BaseAdapter[] = [];
    bullBoard: any;

    private constructor() { }

    static getInstance(): QManagerForAdminUI {
        if (!QManagerForAdminUI.instance && cluster.isPrimary) {
            QManagerForAdminUI.instance = new QManagerForAdminUI();
        }
        return QManagerForAdminUI.instance;
    }

    addQueue(q: Queue) {
        if (cluster.isPrimary) {
            this.qList.push(new BullMQAdapter(q));
            this.createAdminServer(this.qList);
        }
    }

    private createAdminServer(queues: BaseAdapter[]) {
        this.bullBoard = createBullBoard({
            queues,
            serverAdapter,
        });
    }

}

// Create singleton instance
export const qManagerForAdminUI = QManagerForAdminUI.getInstance();

export class AdminServer {
    private static instance: AdminServer;
    private server = fastify();

    private constructor() {
        if(qManagerForAdminUI.qList.length) {
            this.setup();
        }
    }

    static getInstance(): AdminServer {
        if (!AdminServer.instance) {
            AdminServer.instance = new AdminServer();
        }
        return AdminServer.instance;
    }

    private setup() {
        this.server.register(serverAdapter.registerPlugin(), { prefix: '/ui', basePath: '/ui' });
        this.start();
    }

    private start() {
        this.server.listen({ port: 3002 }, (err) => {
            if (err) {
                console.error('Failed to start admin server:', err);
                process.exit(1);
            }
            console.log('Admin UI available on http://localhost:3002/ui');
        });
    }
}