import { JsStack } from '@/layouts/js-stack';
import { CardStyleInterpolators } from '@react-navigation/stack';

export default function ModalLayout() {
    return (
        <JsStack
            screenOptions={{
                presentation: 'modal',
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'vertical',
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
                detachPreviousScreen: false,
                cardStyle: {
                    backgroundColor: 'transparent',
                },
                cardOverlayEnabled: true,
            }}
        />
    );
}
