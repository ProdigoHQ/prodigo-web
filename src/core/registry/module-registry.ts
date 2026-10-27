import { ModuleManifest } from "./module-manifest";

class ModuleRegistry {
  private manifests = new Map<string, ModuleManifest>();

  register(manifest: ModuleManifest): void {
    this.manifests.set(manifest.key, manifest);
  }

  unregister(key: string): void {
    this.manifests.delete(key);
  }

  get(key: string): ModuleManifest | undefined {
    return this.manifests.get(key);
  }

  getAll(): ModuleManifest[] {
    return Array.from(this.manifests.values());
  }

  getEnabledFor(
    enabledModuleKeys: string[],
    userPermissions: string[]
  ): ModuleManifest[] {
    return this.getAll().filter((m) => {
      // Core modules don't require subscription
      if ((m as any).core) {
        if (!m.requiredPermissions?.length) return true;
        return m.requiredPermissions.some((p) => userPermissions?.includes(p));
      }
      if (!enabledModuleKeys?.includes(m.key)) return false;
      if (!m.requiredPermissions?.length) return true;
      return m.requiredPermissions.some((p) => userPermissions?.includes(p));
    });
  }

  getNav(
    enabledModuleKeys: string[],
    userPermissions: string[]
  ): Array<ModuleManifest["navItems"][number] & { moduleKey: string }> {
    const modules = this.getEnabledFor(enabledModuleKeys, userPermissions);
    return modules
      .flatMap((m) =>
        m.navItems.map((n) => ({ ...n, moduleKey: m.key }))
      )
      .filter(
        (n) =>
          !n.permissions?.length ||
          n.permissions.some((p) => userPermissions?.includes(p)) ||
          userPermissions?.some((up) => {
            if (!up) return false;
            const [mk] = up.split(".");
            return mk === (n as any).moduleKey?.toUpperCase?.();
          })
      )
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }

  getRoutes(
    enabledModuleKeys: string[],
    userPermissions: string[]
  ): Array<NonNullable<ModuleManifest["routes"]>[number] & { moduleKey: string }> {
    const modules = this.getEnabledFor(enabledModuleKeys, userPermissions);
    return modules.flatMap((m) =>
      (m.routes ?? []).map((r) => ({ ...r, moduleKey: m.key }))
    );
  }

  getWidgets(
    enabledModuleKeys: string[],
    userPermissions: string[]
  ): Array<NonNullable<ModuleManifest["widgets"]>[number] & { moduleKey: string }> {
    const modules = this.getEnabledFor(enabledModuleKeys, userPermissions);
    return modules.flatMap((m) =>
      (m.widgets ?? []).map((w) => ({ ...w, moduleKey: m.key }))
    );
  }
}

export const moduleRegistry = new ModuleRegistry();
