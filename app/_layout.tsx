import AppBootstrap from "@/src/AppBootstrap";
import AppNavigation from "@/src/navigation";
import { store } from "@/src/redux/store";
import "react-native-reanimated";
import { Provider } from "react-redux";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppBootstrap>
        <AppNavigation />
      </AppBootstrap>
    </Provider>
  );
}
